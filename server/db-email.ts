import { db } from "./db";
import { emailSettings, emailEvents, emailLogs } from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const EmailDB = {
  // Settings
  async getSettings() {
    return await db.query.emailSettings.findFirst({
      where: eq(emailSettings.isActive, true),
    });
  },

  async upsertSettings(data: typeof emailSettings.$inferInsert) {
    // Deactivate all existing settings first
    await db.update(emailSettings).set({ isActive: false });
    
    // Insert new settings
    return await db.insert(emailSettings).values({
      ...data,
      id: data.id || nanoid(),
      isActive: true,
    });
  },

  // Events/Templates
  async getAllEvents() {
    return await db.query.emailEvents.findMany();
  },

  async getEventByName(eventName: string) {
    return await db.query.emailEvents.findFirst({
      where: eq(emailEvents.eventName, eventName),
    });
  },

  async updateEvent(id: string, data: Partial<typeof emailEvents.$inferInsert>) {
    return await db.update(emailEvents)
      .set(data)
      .where(eq(emailEvents.id, id));
  },

  async createEvent(data: typeof emailEvents.$inferInsert) {
    return await db.insert(emailEvents).values({
      ...data,
      id: data.id || nanoid(),
    });
  },

  // Logs
  async getLogs(limit = 50, offset = 0) {
    return await db.query.emailLogs.findMany({
      orderBy: [desc(emailLogs.createdAt)],
      limit,
      offset,
    });
  },

  async getStats() {
    const result = await db.select({
      status: emailLogs.status,
      count: sql<number>`count(*)`,
    })
    .from(emailLogs)
    .groupBy(emailLogs.status);

    const stats = {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
      bounced: 0
    };

    result.forEach(row => {
      if (row.status) {
        stats[row.status] = Number(row.count);
        stats.total += Number(row.count);
      }
    });

    return stats;
  }
};
