import { router, publicProcedure, protectedProcedure } from "./trpc";
import { z } from "zod";
import { EmailDB } from "./db-email";
import { testSMTPConnection } from "./email-service";
import { TRPCError } from "@trpc/server";

export const emailRouter = router({
  // --- Settings ---
  getActiveSettings: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await EmailDB.getSettings();
  }),

  upsertSettings: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      smtpHost: z.string(),
      smtpPort: z.number(),
      smtpSecure: z.boolean(),
      smtpUser: z.string(),
      smtpPassword: z.string(),
      fromEmail: z.string().email(),
      fromName: z.string(),
      replyToEmail: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await EmailDB.upsertSettings(input);
    }),

  testConnection: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await testSMTPConnection();
  }),

  // --- Events/Templates ---
  getAllEvents: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await EmailDB.getAllEvents();
  }),

  getEventByName: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await EmailDB.getEventByName(input);
    }),

  updateEvent: protectedProcedure
    .input(z.object({
      id: z.string(),
      subject: z.string().optional(),
      htmlTemplate: z.string().optional(),
      textTemplate: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const { id, ...data } = input;
      return await EmailDB.updateEvent(id, data);
    }),

  // --- Logs ---
  getLogs: protectedProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await EmailDB.getLogs(input.limit, input.offset);
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await EmailDB.getStats();
  }),
});
