import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Check if user has admin role
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  // Try to get admin record, create if doesn't exist
  const { getAdminByUserId } = await import("./db-admin");
  let admin = await getAdminByUserId(ctx.user.id);

  // If no admin record exists for this admin user, they can still access but with null admin record
  // This allows platform owners to access admin panel immediately
  return next({
    ctx: {
      ...ctx,
      admin: admin || null,
    },
  });
});

export const adminRouter = router({
  // Dashboard analytics
  analytics: adminProcedure.query(async () => {
    const { getPlatformAnalytics, getUserStats, getAgentStats } = await import(
      "./db-admin"
    );
    const platformStats = await getPlatformAnalytics();
    const userStats = await getUserStats();
    const agentStats = await getAgentStats();

    return {
      platform: platformStats,
      users: userStats,
      agents: agentStats,
    };
  }),

  revenueChart: adminProcedure
    .input(
      z.object({
        days: z.number().default(30),
      })
    )
    .query(async ({ input }) => {
      const { getRevenueByPeriod } = await import("./db-admin");
      return await getRevenueByPeriod(input.days);
    }),

  // User Management
  users: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(100),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const { getAllUsers } = await import("./db-admin");
        return await getAllUsers(input.limit, input.offset);
      }),

    suspend: adminProcedure
      .input(
        z.object({
          userId: z.string(),
          reason: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { suspendUser, logAdminActivity } = await import("./db-admin");
        await suspendUser(input.userId, input.reason);
        await logAdminActivity({
          adminId: ctx.admin.id,
          action: "user_suspended",
          targetType: "user",
          targetId: input.userId,
          details: JSON.stringify({ reason: input.reason }),
          ipAddress: null,
          userAgent: null,
        });
        return { success: true };
      }),
  }),

  // Partner Management
  partners: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { getAllPartners } = await import("./db-admin");
        return await getAllPartners(input.status);
      }),

    approve: adminProcedure
      .input(z.object({ partnerId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { approvePartner } = await import("./db-admin");
        await approvePartner(input.partnerId, ctx.admin.id);
        return { success: true };
      }),

    reject: adminProcedure
      .input(
        z.object({
          partnerId: z.string(),
          reason: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { rejectPartner } = await import("./db-admin");
        await rejectPartner(input.partnerId, ctx.admin.id, input.reason);
        return { success: true };
      }),
  }),

  // Agent Management
  agents: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { getAllAgents } = await import("./db-admin");
        return await getAllAgents(input.status);
      }),

    approve: adminProcedure
      .input(z.object({ agentId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { approveAgent } = await import("./db-admin");
        await approveAgent(input.agentId, ctx.admin.id);
        return { success: true };
      }),

    commissions: adminProcedure.query(async () => {
      const { agentCommissions } = await import("../drizzle/schema");
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];

      const { eq } = await import("drizzle-orm");
      return await db
        .select()
        .from(agentCommissions)
        .where(eq(agentCommissions.status, "pending"))
        .limit(50);
    }),

    approveCommission: adminProcedure
      .input(z.object({ commissionId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { approveCommission } = await import("./db-agent");
        await approveCommission(input.commissionId, ctx.admin.id);
        return { success: true };
      }),

    withdrawals: adminProcedure.query(async () => {
      const { getAllPendingWithdrawals } = await import("./db-agent");
      return await getAllPendingWithdrawals();
    }),

    approveWithdrawal: adminProcedure
      .input(
        z.object({
          withdrawalId: z.string(),
          transactionReference: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { approveWithdrawal } = await import("./db-agent");
        await approveWithdrawal(
          input.withdrawalId,
          ctx.admin.id,
          input.transactionReference
        );
        return { success: true };
      }),
  }),

  // Content Moderation
  content: router({
    pending: adminProcedure.query(async () => {
      const { getPendingContent } = await import("./db-admin");
      return await getPendingContent();
    }),

    approve: adminProcedure
      .input(
        z.object({
          contentType: z.enum(["event", "venue", "hotel", "vendor"]),
          contentId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { approveContent } = await import("./db-admin");
        await approveContent(
          input.contentType,
          input.contentId,
          ctx.admin.id
        );
        return { success: true };
      }),
  }),

  // Support Tickets
  tickets: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { getAllTickets } = await import("./db-admin");
        return await getAllTickets(input.status);
      }),

    getById: adminProcedure
      .input(z.object({ ticketId: z.string() }))
      .query(async ({ input }) => {
        const { getTicketById, getTicketMessages } = await import(
          "./db-admin"
        );
        const ticket = await getTicketById(input.ticketId);
        const messages = await getTicketMessages(input.ticketId);
        return { ticket, messages };
      }),

    assign: adminProcedure
      .input(z.object({ ticketId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { assignTicket } = await import("./db-admin");
        await assignTicket(input.ticketId, ctx.admin.id);
        return { success: true };
      }),

    addMessage: adminProcedure
      .input(
        z.object({
          ticketId: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addTicketMessage } = await import("./db-admin");
        await addTicketMessage({
          id: nanoid(),
          ticketId: input.ticketId,
          senderId: ctx.admin.userId,
          senderType: "admin",
          message: input.message,
          attachments: null,
          createdAt: new Date(),
        });
        return { success: true };
      }),

    resolve: adminProcedure
      .input(z.object({ ticketId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { resolveTicket } = await import("./db-admin");
        await resolveTicket(input.ticketId, ctx.admin.id);
        return { success: true };
      }),
  }),

  // Platform Settings
  settings: router({
    list: adminProcedure.query(async () => {
      const { getAllSettings } = await import("./db-admin");
      return await getAllSettings();
    }),

    update: adminProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { updateSetting } = await import("./db-admin");
        await updateSetting(input.key, input.value, ctx.admin.id);
        return { success: true };
      }),
  }),

  // Commission Rates
  commissionRates: router({
    list: adminProcedure.query(async () => {
      const { getAllCommissionRates } = await import("./db-admin");
      return await getAllCommissionRates();
    }),

    create: adminProcedure
      .input(
        z.object({
          entityType: z.enum(["partner", "agent"]),
          productType: z.enum(["event", "venue", "hotel", "vendor", "all"]),
          rateType: z.enum(["percentage", "fixed"]),
          rateValue: z.number(),
          tierName: z.string().optional(),
          effectiveFrom: z.date(),
        })
      )
      .mutation(async ({ input }) => {
        const { createCommissionRate } = await import("./db-admin");
        await createCommissionRate({
          id: nanoid(),
          ...input,
          minAmount: null,
          maxAmount: null,
          status: "active",
          effectiveTo: null,
          createdAt: new Date(),
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          rateId: z.string(),
          rateValue: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const { updateCommissionRate } = await import("./db-admin");
        await updateCommissionRate(input.rateId, input.rateValue);
        return { success: true };
      }),
  }),

  // Activity Logs
  activityLogs: adminProcedure
    .input(
      z.object({
        adminId: z.string().optional(),
        limit: z.number().default(100),
      })
    )
    .query(async ({ input }) => {
      const { getAdminActivityLogs } = await import("./db-admin");
      return await getAdminActivityLogs(input.adminId, input.limit);
    }),
});

