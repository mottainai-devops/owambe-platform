import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { reviews, reviewResponses, reviewHelpful } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export const reviewsRouter = router({
  // Submit a review
  create: protectedProcedure
    .input(
      z.object({
        itemType: z.enum(["event", "venue", "hotel", "vendor"]),
        itemId: z.string(),
        bookingId: z.string().optional(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        comment: z.string(),
        pros: z.string().optional(),
        cons: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const review = {
        id: nanoid(),
        userId: ctx.user.id,
        ...input,
        isVerifiedPurchase: !!input.bookingId,
        status: "pending" as const,
        createdAt: new Date(),
      };

      await db.insert(reviews).values(review);
      return { success: true, reviewId: review.id };
    }),

  // Get reviews for an item
  getByItem: publicProcedure
    .input(
      z.object({
        itemType: z.enum(["event", "venue", "hotel", "vendor"]),
        itemId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.itemType, input.itemType), eq(reviews.itemId, input.itemId), eq(reviews.status, "approved")))
        .orderBy(desc(reviews.createdAt));
    }),

  // Mark review as helpful
  markHelpful: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(reviewHelpful).values({
        id: nanoid(),
        reviewId: input.reviewId,
        userId: ctx.user.id,
        createdAt: new Date(),
      });

      // Increment helpful count
      const [review] = await db.select().from(reviews).where(eq(reviews.id, input.reviewId)).limit(1);
      if (review) {
        await db
          .update(reviews)
          .set({ helpfulCount: (review.helpfulCount || 0) + 1 })
          .where(eq(reviews.id, input.reviewId));
      }

      return { success: true };
    }),

  // Add response to review (for partners/vendors)
  respond: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        response: z.string(),
        responderType: z.enum(["partner", "vendor", "admin"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(reviewResponses).values({
        id: nanoid(),
        reviewId: input.reviewId,
        responderId: ctx.user.id,
        responderType: input.responderType,
        response: input.response,
        createdAt: new Date(),
      });

      return { success: true };
    }),

  // Get user's reviews
  myReviews: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return await db.select().from(reviews).where(eq(reviews.userId, ctx.user.id)).orderBy(desc(reviews.createdAt));
  }),
});

