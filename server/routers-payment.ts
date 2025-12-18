import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  initializePayment,
  verifyPayment,
  processRefund,
  generatePaymentReference,
  getPaystackPublicKey,
  verifyWebhookSignature,
} from "./payment-service";
import { getDb } from "./db";
import { payments, bookings, agentCommissions, agentWalletTransactions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const paymentRouter = router({
  // Get Paystack public key
  getPublicKey: publicProcedure.query(() => {
    return { publicKey: getPaystackPublicKey() };
  }),

  // Initialize payment
  initialize: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        amount: z.number(),
        email: z.string().email(),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reference = generatePaymentReference();
      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      // Create payment record
      await db.insert(payments).values({
        id: nanoid(),
        bookingId: input.bookingId,
        userId: ctx.user.id,
        amount: input.amount,
        currency: "NGN",
        paymentMethod: "paystack",
        paymentReference: reference,
        status: "pending",
        createdAt: new Date(),
      });

      // Initialize payment with Paystack
      const result = await initializePayment({
        email: input.email,
        amount: input.amount, // Already in kobo
        reference,
        callback_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/payment/verify?reference=${reference}`,
        metadata: {
          bookingId: input.bookingId,
          userId: ctx.user.id,
          ...input.metadata,
        },
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      });

      if (!result.success) {
        // Update payment status to failed
        await db
          .update(payments)
          .set({ status: "failed", failureReason: result.error })
          .where(eq(payments.paymentReference, reference));

        throw new Error(result.error || "Payment initialization failed");
      }

      return {
        success: true,
        authorization_url: result.authorization_url,
        access_code: result.access_code,
        reference: result.reference,
      };
    }),

  // Verify payment
  verify: protectedProcedure
    .input(
      z.object({
        reference: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      // Get payment record
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.paymentReference, input.reference))
        .limit(1);

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Verify with Paystack
      const result = await verifyPayment(input.reference);

      if (!result.success || !result.data) {
        // Update payment status to failed
        await db
          .update(payments)
          .set({ status: "failed", failureReason: result.error })
          .where(eq(payments.id, payment.id));

        throw new Error(result.error || "Payment verification failed");
      }

      const paystackData = result.data;

      // Check if payment was successful
      if (paystackData.status !== "success") {
        await db
          .update(payments)
          .set({ status: "failed", failureReason: paystackData.gateway_response })
          .where(eq(payments.id, payment.id));

        throw new Error("Payment was not successful");
      }

      // Update payment status to completed
      await db
        .update(payments)
        .set({
          status: "completed",
          paidAt: new Date(paystackData.paid_at),
          gatewayResponse: JSON.stringify(paystackData),
        })
        .where(eq(payments.id, payment.id));

      // Update booking status to confirmed
      await db
        .update(bookings)
        .set({ status: "confirmed", paymentStatus: "paid" })
        .where(eq(bookings.id, payment.bookingId));

      // Process agent commission if applicable
      const metadata = paystackData.metadata;
      if (metadata?.agentId && metadata?.referralCode) {
        const commissionAmount = Math.floor(paystackData.amount * 0.1); // 10% commission

        // Create commission record
        await db.insert(agentCommissions).values({
          id: nanoid(),
          agentId: metadata.agentId,
          referralId: metadata.referralId,
          bookingId: payment.bookingId,
          productType: metadata.productType,
          productId: metadata.productId,
          bookingAmount: paystackData.amount,
          commissionAmount,
          commissionRate: 10,
          status: "pending",
          createdAt: new Date(),
        });

        // Add to agent wallet as pending
        await db.insert(agentWalletTransactions).values({
          id: nanoid(),
          agentId: metadata.agentId,
          amount: commissionAmount,
          transactionType: "credit",
          description: `Commission from booking ${payment.bookingId}`,
          status: "pending",
          createdAt: new Date(),
        });
      }

      return {
        success: true,
        payment: {
          id: payment.id,
          amount: paystackData.amount,
          status: "completed",
          paidAt: paystackData.paid_at,
        },
      };
    }),

  // Request refund
  refund: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
        amount: z.number().optional(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      // Get payment record
      const [payment] = await db.select().from(payments).where(eq(payments.id, input.paymentId)).limit(1);

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Verify user owns this payment
      if (payment.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      // Check if payment is completed
      if (payment.status !== "completed") {
        throw new Error("Payment is not completed");
      }

      // Process refund with Paystack
      const result = await processRefund(payment.paymentReference, input.amount, input.reason);

      if (!result.success) {
        throw new Error(result.error || "Refund processing failed");
      }

      // Update payment status
      await db
        .update(payments)
        .set({
          status: "refunded",
          refundedAt: new Date(),
          refundAmount: input.amount || payment.amount,
          refundReason: input.reason,
        })
        .where(eq(payments.id, payment.id));

      // Update booking status
      await db
        .update(bookings)
        .set({ status: "cancelled", paymentStatus: "refunded" })
        .where(eq(bookings.id, payment.bookingId));

      return {
        success: true,
        message: "Refund processed successfully",
      };
    }),

  // Get payment history
  history: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      return [];
    }

    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, ctx.user.id))
      .orderBy(payments.createdAt);

    return userPayments;
  }),

  // Webhook handler (for Paystack callbacks)
  webhook: publicProcedure
    .input(
      z.object({
        event: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Note: In production, verify webhook signature from headers
      // const signature = ctx.req.headers["x-paystack-signature"];
      // const isValid = verifyWebhookSignature(JSON.stringify(input), signature);

      const db = await getDb();

      if (!db) {
        throw new Error("Database not available");
      }

      switch (input.event) {
        case "charge.success":
          // Payment successful
          const reference = input.data.reference;
          const [payment] = await db
            .select()
            .from(payments)
            .where(eq(payments.paymentReference, reference))
            .limit(1);

          if (payment && payment.status === "pending") {
            await db
              .update(payments)
              .set({
                status: "completed",
                paidAt: new Date(input.data.paid_at),
                gatewayResponse: JSON.stringify(input.data),
              })
              .where(eq(payments.id, payment.id));

            await db
              .update(bookings)
              .set({ status: "confirmed", paymentStatus: "paid" })
              .where(eq(bookings.id, payment.bookingId));
          }
          break;

        case "charge.failed":
          // Payment failed
          const failedRef = input.data.reference;
          await db
            .update(payments)
            .set({
              status: "failed",
              failureReason: input.data.gateway_response,
            })
            .where(eq(payments.paymentReference, failedRef));
          break;

        case "transfer.success":
          // Payout successful (for agent withdrawals)
          // Handle payout success
          break;

        case "transfer.failed":
          // Payout failed
          // Handle payout failure
          break;

        default:
          console.log("Unhandled webhook event:", input.event);
      }

      return { success: true };
    }),
});

