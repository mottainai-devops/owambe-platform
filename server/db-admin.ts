import { eq, desc, and, or, sql, count } from "drizzle-orm";
import { getDb } from "./db";
import {
  admins,
  adminRoles,
  adminActivityLogs,
  supportTickets,
  ticketMessages,
  platformSettings,
  commissionRates,
  users,
  b2bPartners,
  agents,
  bookings,
  payments,
  events,
  venues,
  hotels,
  vendors,
  type Admin,
  type InsertAdmin,
  type AdminRole,
  type InsertAdminRole,
  type InsertAdminActivityLog,
  type SupportTicket,
  type InsertSupportTicket,
  type InsertTicketMessage,
  type PlatformSetting,
  type InsertPlatformSetting,
  type CommissionRate,
  type InsertCommissionRate,
} from "../drizzle/schema";

// ============================================
// ADMIN MANAGEMENT
// ============================================

export async function getAdminByUserId(userId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(admins)
    .where(eq(admins.userId, userId))
    .limit(1);

  return result[0];
}

export async function createAdmin(admin: InsertAdmin) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(admins).values(admin);
}

export async function getAllAdmins() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(admins).orderBy(desc(admins.createdAt));
}

export async function updateAdminStatus(
  adminId: string,
  status: "active" | "inactive" | "suspended"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(admins).set({ status }).where(eq(admins.id, adminId));
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function getAllUsers(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getUserStats() {
  const db = await getDb();
  if (!db) return { total: 0, newThisMonth: 0, active: 0 };

  const [totalResult] = await db.select({ count: count() }).from(users);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [newUsersResult] = await db
    .select({ count: count() })
    .from(users)
    .where(sql`${users.createdAt} >= ${thirtyDaysAgo}`);

  return {
    total: totalResult.count,
    newThisMonth: newUsersResult.count,
    active: totalResult.count, // TODO: Add actual activity tracking
  };
}

export async function suspendUser(userId: string, reason: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update user role or add suspended flag
  // For now, we'll log the action
  await logAdminActivity({
    adminId: "system",
    action: "user_suspended",
    targetType: "user",
    targetId: userId,
    details: JSON.stringify({ reason }),
    ipAddress: null,
    userAgent: null,
  });
}

// ============================================
// PARTNER MANAGEMENT
// ============================================

export async function getAllPartners(status?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(b2bPartners).orderBy(desc(b2bPartners.createdAt));

  if (status) {
    query = query.where(eq(b2bPartners.status, status as any));
  }

  return await query;
}

export async function approvePartner(partnerId: string, adminId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(b2bPartners)
    .set({ status: "approved" })
    .where(eq(b2bPartners.id, partnerId));

  await logAdminActivity({
    adminId,
    action: "partner_approved",
    targetType: "partner",
    targetId: partnerId,
    details: null,
    ipAddress: null,
    userAgent: null,
  });
}

export async function rejectPartner(
  partnerId: string,
  adminId: string,
  reason: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(b2bPartners)
    .set({ status: "rejected" })
    .where(eq(b2bPartners.id, partnerId));

  await logAdminActivity({
    adminId,
    action: "partner_rejected",
    targetType: "partner",
    targetId: partnerId,
    details: JSON.stringify({ reason }),
    ipAddress: null,
    userAgent: null,
  });
}

// ============================================
// AGENT MANAGEMENT
// ============================================

export async function getAllAgents(status?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(agents).orderBy(desc(agents.createdAt));

  if (status) {
    query = query.where(eq(agents.status, status as any));
  }

  return await query;
}

export async function approveAgent(agentId: string, adminId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(agents)
    .set({ status: "active", verifiedAt: new Date() })
    .where(eq(agents.id, agentId));

  await logAdminActivity({
    adminId,
    action: "agent_approved",
    targetType: "agent",
    targetId: agentId,
    details: null,
    ipAddress: null,
    userAgent: null,
  });
}

export async function getAgentStats() {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, pending: 0 };

  const [totalResult] = await db.select({ count: count() }).from(agents);

  const [activeResult] = await db
    .select({ count: count() })
    .from(agents)
    .where(eq(agents.status, "active"));

  const [pendingResult] = await db
    .select({ count: count() })
    .from(agents)
    .where(eq(agents.status, "pending"));

  return {
    total: totalResult.count,
    active: activeResult.count,
    pending: pendingResult.count,
  };
}

// ============================================
// PLATFORM ANALYTICS
// ============================================

export async function getPlatformAnalytics() {
  const db = await getDb();
  if (!db)
    return {
      totalRevenue: 0,
      totalBookings: 0,
      totalUsers: 0,
      totalPartners: 0,
      totalAgents: 0,
    };

  const [usersCount] = await db.select({ count: count() }).from(users);
  const [partnersCount] = await db.select({ count: count() }).from(b2bPartners);
  const [agentsCount] = await db.select({ count: count() }).from(agents);
  const [bookingsCount] = await db.select({ count: count() }).from(bookings);

  // Calculate total revenue from payments
  const [revenueResult] = await db
    .select({ total: sql<number>`SUM(${payments.amount})` })
    .from(payments)
    .where(eq(payments.status, "completed"));

  return {
    totalRevenue: revenueResult?.total || 0,
    totalBookings: bookingsCount.count,
    totalUsers: usersCount.count,
    totalPartners: partnersCount.count,
    totalAgents: agentsCount.count,
  };
}

export async function getRevenueByPeriod(days = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await db
    .select({
      date: sql<string>`DATE(${payments.createdAt})`,
      revenue: sql<number>`SUM(${payments.amount})`,
      count: count(),
    })
    .from(payments)
    .where(
      and(
        eq(payments.status, "completed"),
        sql`${payments.createdAt} >= ${startDate}`
      )
    )
    .groupBy(sql`DATE(${payments.createdAt})`)
    .orderBy(sql`DATE(${payments.createdAt})`);

  return result;
}

// ============================================
// CONTENT MODERATION
// ============================================

export async function getPendingContent() {
  const db = await getDb();
  if (!db) return { events: [], venues: [], hotels: [], vendors: [] };

  const pendingEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, "draft"))
    .limit(20);

  const pendingVenues = await db
    .select()
    .from(venues)
    .where(eq(venues.status, "inactive"))
    .limit(20);

  const pendingHotels = await db
    .select()
    .from(hotels)
    .where(eq(hotels.status, "inactive"))
    .limit(20);

  const pendingVendors = await db
    .select()
    .from(vendors)
    .where(eq(vendors.status, "inactive"))
    .limit(20);

  return {
    events: pendingEvents,
    venues: pendingVenues,
    hotels: pendingHotels,
    vendors: pendingVendors,
  };
}

export async function approveContent(
  contentType: "event" | "venue" | "hotel" | "vendor",
  contentId: string,
  adminId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  switch (contentType) {
    case "event":
      await db
        .update(events)
        .set({ status: "published" })
        .where(eq(events.id, contentId));
      break;
    case "venue":
      await db
        .update(venues)
        .set({ status: "active" })
        .where(eq(venues.id, contentId));
      break;
    case "hotel":
      await db
        .update(hotels)
        .set({ status: "active" })
        .where(eq(hotels.id, contentId));
      break;
    case "vendor":
      await db
        .update(vendors)
        .set({ status: "active" })
        .where(eq(vendors.id, contentId));
      break;
  }

  await logAdminActivity({
    adminId,
    action: `${contentType}_approved`,
    targetType: contentType,
    targetId: contentId,
    details: null,
    ipAddress: null,
    userAgent: null,
  });
}

// ============================================
// SUPPORT TICKETS
// ============================================

export async function getAllTickets(status?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.createdAt));

  if (status) {
    query = query.where(eq(supportTickets.status, status as any));
  }

  return await query;
}

export async function getTicketById(ticketId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [ticket] = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, ticketId))
    .limit(1);

  return ticket;
}

export async function getTicketMessages(ticketId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(ticketMessages)
    .where(eq(ticketMessages.ticketId, ticketId))
    .orderBy(ticketMessages.createdAt);
}

export async function createTicket(ticket: InsertSupportTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(supportTickets).values(ticket);
}

export async function addTicketMessage(message: InsertTicketMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(ticketMessages).values(message);

  // Update ticket updatedAt
  await db
    .update(supportTickets)
    .set({ updatedAt: new Date() })
    .where(eq(supportTickets.id, message.ticketId));
}

export async function assignTicket(ticketId: string, adminId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(supportTickets)
    .set({ assignedTo: adminId, status: "in_progress" })
    .where(eq(supportTickets.id, ticketId));
}

export async function resolveTicket(ticketId: string, adminId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(supportTickets)
    .set({ status: "resolved", resolvedAt: new Date() })
    .where(eq(supportTickets.id, ticketId));

  await logAdminActivity({
    adminId,
    action: "ticket_resolved",
    targetType: "ticket",
    targetId: ticketId,
    details: null,
    ipAddress: null,
    userAgent: null,
  });
}

// ============================================
// PLATFORM SETTINGS
// ============================================

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(platformSettings);
}

export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [setting] = await db
    .select()
    .from(platformSettings)
    .where(eq(platformSettings.settingKey, key))
    .limit(1);

  return setting;
}

export async function updateSetting(
  key: string,
  value: string,
  adminId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(platformSettings)
    .set({ settingValue: value, updatedBy: adminId, updatedAt: new Date() })
    .where(eq(platformSettings.settingKey, key));

  await logAdminActivity({
    adminId,
    action: "setting_updated",
    targetType: "setting",
    targetId: key,
    details: JSON.stringify({ newValue: value }),
    ipAddress: null,
    userAgent: null,
  });
}

// ============================================
// COMMISSION RATES
// ============================================

export async function getAllCommissionRates() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(commissionRates)
    .where(eq(commissionRates.status, "active"))
    .orderBy(commissionRates.entityType, commissionRates.productType);
}

export async function createCommissionRate(rate: InsertCommissionRate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(commissionRates).values(rate);
}

export async function updateCommissionRate(rateId: string, rateValue: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(commissionRates)
    .set({ rateValue })
    .where(eq(commissionRates.id, rateId));
}

// ============================================
// ADMIN ACTIVITY LOGS
// ============================================

export async function logAdminActivity(log: InsertAdminActivityLog) {
  const db = await getDb();
  if (!db) return;

  await db.insert(adminActivityLogs).values(log);
}

export async function getAdminActivityLogs(adminId?: string, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(adminActivityLogs)
    .orderBy(desc(adminActivityLogs.createdAt))
    .limit(limit);

  if (adminId) {
    query = query.where(eq(adminActivityLogs.adminId, adminId));
  }

  return await query;
}

