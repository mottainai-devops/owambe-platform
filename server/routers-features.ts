import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  notifications,
  notificationSettings,
  conversations,
  messages,
  loyaltyPoints,
  pointTransactions,
  userReferrals,
} from "../drizzle/schema";
import { eq, and, or, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Notifications Router
export const notificationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, ctx.user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }),

  markRead: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, input.id));
    return { success: true };
  }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, ctx.user.id));
    return { success: true };
  }),

  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const [settings] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, ctx.user.id))
      .limit(1);
    return settings || null;
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        smsNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        bookingUpdates: z.boolean().optional(),
        paymentUpdates: z.boolean().optional(),
        promotions: z.boolean().optional(),
        reviews: z.boolean().optional(),
        messages: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select()
        .from(notificationSettings)
        .where(eq(notificationSettings.userId, ctx.user.id))
        .limit(1);

      if (existing) {
        await db.update(notificationSettings).set(input).where(eq(notificationSettings.userId, ctx.user.id));
      } else {
        await db.insert(notificationSettings).values({
          id: nanoid(),
          userId: ctx.user.id,
          ...input,
        });
      }

      return { success: true };
    }),
});

// Messaging Router
export const messagingRouter = router({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(conversations)
      .where(or(eq(conversations.participant1Id, ctx.user.id), eq(conversations.participant2Id, ctx.user.id)))
      .orderBy(desc(conversations.lastMessageAt));
  }),

  getConversation: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) return null;

    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        or(
          and(eq(conversations.participant1Id, ctx.user.id), eq(conversations.participant2Id, input.userId)),
          and(eq(conversations.participant1Id, input.userId), eq(conversations.participant2Id, ctx.user.id))
        )
      )
      .limit(1);

    return conversation || null;
  }),

  messages: protectedProcedure.input(z.object({ conversationId: z.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, input.conversationId))
      .orderBy(messages.createdAt);
  }),

  send: protectedProcedure
    .input(
      z.object({
        recipientId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Find or create conversation
      let [conversation] = await db
        .select()
        .from(conversations)
        .where(
          or(
            and(eq(conversations.participant1Id, ctx.user.id), eq(conversations.participant2Id, input.recipientId)),
            and(eq(conversations.participant1Id, input.recipientId), eq(conversations.participant2Id, ctx.user.id))
          )
        )
        .limit(1);

      if (!conversation) {
        const newConv = {
          id: nanoid(),
          participant1Id: ctx.user.id,
          participant2Id: input.recipientId,
          lastMessageAt: new Date(),
          createdAt: new Date(),
        };
        await db.insert(conversations).values(newConv);
        conversation = newConv;
      } else {
        await db
          .update(conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversations.id, conversation.id));
      }

      // Create message
      const message = {
        id: nanoid(),
        conversationId: conversation.id,
        senderId: ctx.user.id,
        content: input.content,
        isRead: false,
        createdAt: new Date(),
      };

      await db.insert(messages).values(message);

      // Create notification for recipient
      await db.insert(notifications).values({
        id: nanoid(),
        userId: input.recipientId,
        type: "message",
        title: "New Message",
        message: `You have a new message from ${ctx.user.name}`,
        actionUrl: `/messages/${conversation.id}`,
        isRead: false,
        createdAt: new Date(),
      });

      return { success: true, conversationId: conversation.id };
    }),

  markRead: protectedProcedure.input(z.object({ conversationId: z.string() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.conversationId, input.conversationId), eq(messages.isRead, false)));

    return { success: true };
  }),
});

// Loyalty Router
export const loyaltyRouter = router({
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    let [points] = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, ctx.user.id)).limit(1);

    if (!points) {
      // Create initial points record
      points = {
        id: nanoid(),
        userId: ctx.user.id,
        points: 0,
        tier: "bronze" as const,
        lifetimePoints: 0,
        updatedAt: new Date(),
      };
      await db.insert(loyaltyPoints).values(points);
    }

    return points;
  }),

  transactions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(pointTransactions)
      .where(eq(pointTransactions.userId, ctx.user.id))
      .orderBy(desc(pointTransactions.createdAt))
      .limit(50);
  }),

  getReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    // Generate or get existing referral code
    const code = `REF-${ctx.user.id.substring(0, 8).toUpperCase()}`;

    return { code, shareUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}?ref=${code}` };
  }),

  myReferrals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return await db
      .select()
      .from(userReferrals)
      .where(eq(userReferrals.referrerId, ctx.user.id))
      .orderBy(desc(userReferrals.createdAt));
  }),
});

// Search Router
export const searchRouter = router({
  all: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        type: z.enum(["all", "events", "venues", "hotels", "vendors"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { events: [], venues: [], hotels: [], vendors: [] };

      const { events, venues, hotels, vendors } = await import("../drizzle/schema");
      const { like } = await import("drizzle-orm");

      const searchPattern = `%${input.query}%`;

      const results: any = {
        events: [],
        venues: [],
        hotels: [],
        vendors: [],
      };

      if (!input.type || input.type === "all" || input.type === "events") {
        results.events = await db
          .select()
          .from(events)
          .where(
            or(
              like(events.title, searchPattern),
              like(events.description, searchPattern),
              like(events.location, searchPattern)
            )
          )
          .limit(10);
      }

      if (!input.type || input.type === "all" || input.type === "venues") {
        results.venues = await db
          .select()
          .from(venues)
          .where(
            or(
              like(venues.name, searchPattern),
              like(venues.description, searchPattern),
              like(venues.location, searchPattern)
            )
          )
          .limit(10);
      }

      if (!input.type || input.type === "all" || input.type === "hotels") {
        results.hotels = await db
          .select()
          .from(hotels)
          .where(
            or(
              like(hotels.name, searchPattern),
              like(hotels.description, searchPattern),
              like(hotels.location, searchPattern)
            )
          )
          .limit(10);
      }

      if (!input.type || input.type === "all" || input.type === "vendors") {
        results.vendors = await db
          .select()
          .from(vendors)
          .where(
            or(
              like(vendors.businessName, searchPattern),
              like(vendors.description, searchPattern),
              like(vendors.city, searchPattern)
            )
          )
          .limit(10);
      }

      return results;
    }),
});

