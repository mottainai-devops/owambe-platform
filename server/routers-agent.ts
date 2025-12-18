import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";

// Agent-only procedure (admins can also access)
const agentProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Allow admins to access agent portal
  if (ctx.user.role === "admin") {
    return next({
      ctx: {
        ...ctx,
        agent: null, // Admin doesn't have agent record
      },
    });
  }

  const { getAgentByUserId } = await import("./db-agent");
  const agent = await getAgentByUserId(ctx.user.id);

  if (!agent || agent.status !== "active") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Agent access required",
    });
  }

  return next({
    ctx: {
      ...ctx,
      agent,
    },
  });
});

export const agentRouter = router({
  // Check if user is an agent
  isAgent: protectedProcedure.query(async ({ ctx }) => {
    const { getAgentByUserId } = await import("./db-agent");
    const agent = await getAgentByUserId(ctx.user.id);
    return {
      isAgent: !!agent,
      agent: agent || null,
    };
  }),

  // Apply to become an agent
  applyToBeAgent: protectedProcedure
    .input(
      z.object({
        businessName: z.string().optional(),
        phoneNumber: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        bankName: z.string(),
        accountNumber: z.string(),
        accountName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { createAgent } = await import("./db-agent");
      const agentCode = `AGT${nanoid(8).toUpperCase()}`;

      await createAgent({
        id: nanoid(),
        userId: ctx.user.id,
        agentCode,
        ...input,
        territory: null,
        tier: "bronze",
        commissionRate: null,
        totalSales: 0,
        totalCommission: 0,
        totalCustomers: 0,
        rating: 0,
        reviewCount: 0,
        taxId: null,
        status: "pending",
        verifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { success: true, agentCode };
    }),

  // Dashboard
  dashboard: agentProcedure.query(async ({ ctx }) => {
    // If admin without agent record, return empty dashboard
    if (!ctx.agent) {
      return {
        agent: null,
        wallet: { balance: 0, totalEarned: 0, totalWithdrawn: 0, pendingCommission: 0 },
        stats: {
          totalReferrals: 0,
          activeReferrals: 0,
          totalCommissions: 0,
          pendingCommissions: 0,
          totalCustomers: 0,
          thisMonthSales: 0,
        },
        recentReferrals: [],
        recentCommissions: [],
        topProducts: [],
      };
    }
    const { getAgentDashboard } = await import("./db-agent");
    return await getAgentDashboard(ctx.agent.id);
  }),

  // Referrals
  referrals: router({
    list: agentProcedure.query(async ({ ctx }) => {
      const { getAgentReferrals } = await import("./db-agent");
      return await getAgentReferrals(ctx.agent.id);
    }),

    create: agentProcedure
      .input(
        z.object({
          productType: z.enum(["event", "venue", "hotel", "vendor", "general"]),
          productId: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createReferral } = await import("./db-agent");
        const referralCode = `${ctx.agent.agentCode}-${nanoid(6).toUpperCase()}`;

        await createReferral({
          id: nanoid(),
          agentId: ctx.agent.id,
          referralCode,
          productType: input.productType,
          productId: input.productId || null,
          customerId: null,
          bookingId: null,
          clickCount: 0,
          conversionStatus: "pending",
          conversionValue: null,
          commissionAmount: null,
          commissionStatus: "pending",
          metadata: null,
          createdAt: new Date(),
          convertedAt: null,
        });

        return { success: true, referralCode };
      }),
  }),

  // Commissions
  commissions: router({
    list: agentProcedure.query(async ({ ctx }) => {
      const { getAgentCommissions } = await import("./db-agent");
      return await getAgentCommissions(ctx.agent.id);
    }),
  }),

  // Wallet
  wallet: router({
    get: agentProcedure.query(async ({ ctx }) => {
      const { getAgentWallet } = await import("./db-agent");
      return await getAgentWallet(ctx.agent.id);
    }),

    transactions: agentProcedure.query(async ({ ctx }) => {
      const { getWalletTransactions } = await import("./db-agent");
      return await getWalletTransactions(ctx.agent.id);
    }),

    withdraw: agentProcedure
      .input(
        z.object({
          amount: z.number().positive(),
          bankName: z.string(),
          accountNumber: z.string(),
          accountName: z.string(),
          withdrawalMethod: z.enum([
            "bank_transfer",
            "mobile_money",
            "paypal",
            "other",
          ]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createWithdrawal, getAgentWallet } = await import(
          "./db-agent"
        );

        const wallet = await getAgentWallet(ctx.agent.id);
        if (!wallet) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Wallet not found",
          });
        }

        if (wallet.balance < input.amount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Insufficient balance",
          });
        }

        await createWithdrawal({
          id: nanoid(),
          agentId: ctx.agent.id,
          walletId: wallet.id,
          amount: input.amount,
          bankName: input.bankName,
          accountNumber: input.accountNumber,
          accountName: input.accountName,
          withdrawalMethod: input.withdrawalMethod,
          status: "pending",
          processedBy: null,
          transactionReference: null,
          failureReason: null,
          processedAt: null,
          createdAt: new Date(),
        });

        return { success: true };
      }),

    withdrawals: agentProcedure.query(async ({ ctx }) => {
      const { getAgentWithdrawals } = await import("./db-agent");
      return await getAgentWithdrawals(ctx.agent.id);
    }),
  }),

  // Customers
  customers: router({
    list: agentProcedure.query(async ({ ctx }) => {
      const { getAgentCustomers } = await import("./db-agent");
      return await getAgentCustomers(ctx.agent.id);
    }),

    add: agentProcedure
      .input(
        z.object({
          customerName: z.string(),
          customerEmail: z.string().email().optional(),
          customerPhone: z.string(),
          leadSource: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createAgentCustomer } = await import("./db-agent");

        await createAgentCustomer({
          id: nanoid(),
          agentId: ctx.agent.id,
          customerId: null,
          customerName: input.customerName,
          customerEmail: input.customerEmail || null,
          customerPhone: input.customerPhone,
          leadStatus: "lead",
          leadSource: input.leadSource,
          totalBookings: 0,
          totalSpent: 0,
          lastContactAt: null,
          notes: input.notes || null,
          tags: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { success: true };
      }),

    updateStatus: agentProcedure
      .input(
        z.object({
          customerId: z.string(),
          leadStatus: z.enum(["lead", "prospect", "customer", "inactive"]),
        })
      )
      .mutation(async ({ input }) => {
        const { updateCustomerStatus } = await import("./db-agent");
        await updateCustomerStatus(input.customerId, input.leadStatus);
        return { success: true };
      }),
  }),

  // Targets
  targets: router({
    list: agentProcedure.query(async ({ ctx }) => {
      const { getAgentTargets } = await import("./db-agent");
      return await getAgentTargets(ctx.agent.id);
    }),
  }),

  // Products (for showcase)
  products: router({
    all: agentProcedure.query(async () => {
      const { getAllProductsForAgent } = await import("./db-agent");
      return await getAllProductsForAgent();
    }),
  }),

  // Performance
  performance: agentProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const { getAgentPerformance } = await import("./db-agent");
      return await getAgentPerformance(ctx.agent.id, input.days);
    }),

  // Track referral click (public endpoint)
  trackClick: publicProcedure
    .input(
      z.object({
        referralCode: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { getReferralByCode, incrementReferralClick } = await import(
        "./db-agent"
      );

      const referral = await getReferralByCode(input.referralCode);
      if (referral) {
        await incrementReferralClick(referral.id);
      }

      return { success: true };
    }),
});

