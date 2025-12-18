import { eq, desc, and, sql, count } from "drizzle-orm";
import { getDb } from "./db";
import {
  agents,
  agentReferrals,
  agentCommissions,
  agentWallets,
  agentWalletTransactions,
  agentWithdrawals,
  agentCustomers,
  agentTargets,
  bookings,
  vendorBookings,
  events,
  venues,
  hotels,
  vendors,
  type Agent,
  type InsertAgent,
  type AgentReferral,
  type InsertAgentReferral,
  type AgentCommission,
  type InsertAgentCommission,
  type AgentWallet,
  type InsertAgentWallet,
  type InsertAgentWalletTransaction,
  type AgentWithdrawal,
  type InsertAgentWithdrawal,
  type AgentCustomer,
  type InsertAgentCustomer,
  type AgentTarget,
  type InsertAgentTarget,
} from "../drizzle/schema";
import { nanoid } from "nanoid";

// ============================================
// AGENT MANAGEMENT
// ============================================

export async function getAgentByUserId(userId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.userId, userId))
    .limit(1);

  return agent;
}

export async function getAgentById(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, agentId))
    .limit(1);

  return agent;
}

export async function createAgent(agent: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agents).values(agent);

  // Create wallet for agent
  await createAgentWallet({
    id: nanoid(),
    agentId: agent.id,
    balance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    currency: "NGN",
    lastTransactionAt: null,
    updatedAt: new Date(),
  });
}

export async function updateAgent(agentId: string, updates: Partial<Agent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(agents).set(updates).where(eq(agents.id, agentId));
}

// ============================================
// AGENT DASHBOARD
// ============================================

export async function getAgentDashboard(agentId: string) {
  const db = await getDb();
  if (!db) return null;

  const agent = await getAgentById(agentId);
  if (!agent) return null;

  const wallet = await getAgentWallet(agentId);

  // Get referral stats
  const [totalReferrals] = await db
    .select({ count: count() })
    .from(agentReferrals)
    .where(eq(agentReferrals.agentId, agentId));

  const [convertedReferrals] = await db
    .select({ count: count() })
    .from(agentReferrals)
    .where(
      and(
        eq(agentReferrals.agentId, agentId),
        eq(agentReferrals.conversionStatus, "converted")
      )
    );

  // Get this month's stats
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const [monthlyCommissions] = await db
    .select({ total: sql<number>`SUM(${agentCommissions.commissionAmount})` })
    .from(agentCommissions)
    .where(
      and(
        eq(agentCommissions.agentId, agentId),
        eq(agentCommissions.status, "approved"),
        sql`${agentCommissions.createdAt} >= ${firstDayOfMonth}`
      )
    );

  const [monthlyReferrals] = await db
    .select({ count: count() })
    .from(agentReferrals)
    .where(
      and(
        eq(agentReferrals.agentId, agentId),
        eq(agentReferrals.conversionStatus, "converted"),
        sql`${agentReferrals.convertedAt} >= ${firstDayOfMonth}`
      )
    );

  return {
    agent,
    wallet,
    stats: {
      totalReferrals: totalReferrals.count,
      convertedReferrals: convertedReferrals.count,
      conversionRate:
        totalReferrals.count > 0
          ? (convertedReferrals.count / totalReferrals.count) * 100
          : 0,
      monthlyCommissions: monthlyCommissions?.total || 0,
      monthlyReferrals: monthlyReferrals.count,
    },
  };
}

// ============================================
// REFERRALS
// ============================================

export async function createReferral(referral: InsertAgentReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentReferrals).values(referral);
}

export async function getReferralByCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [referral] = await db
    .select()
    .from(agentReferrals)
    .where(eq(agentReferrals.referralCode, referralCode))
    .limit(1);

  return referral;
}

export async function getAgentReferrals(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentReferrals)
    .where(eq(agentReferrals.agentId, agentId))
    .orderBy(desc(agentReferrals.createdAt))
    .limit(limit);
}

export async function incrementReferralClick(referralId: string) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(agentReferrals)
    .set({ clickCount: sql`${agentReferrals.clickCount} + 1` })
    .where(eq(agentReferrals.id, referralId));
}

export async function convertReferral(
  referralId: string,
  bookingId: string,
  conversionValue: number,
  commissionAmount: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(agentReferrals)
    .set({
      bookingId,
      conversionStatus: "converted",
      conversionValue,
      commissionAmount,
      commissionStatus: "pending",
      convertedAt: new Date(),
    })
    .where(eq(agentReferrals.id, referralId));
}

// ============================================
// COMMISSIONS
// ============================================

export async function createCommission(commission: InsertAgentCommission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentCommissions).values(commission);

  // Update agent's pending balance
  const wallet = await getAgentWallet(commission.agentId);
  if (wallet) {
    await db
      .update(agentWallets)
      .set({
        pendingBalance: wallet.pendingBalance + commission.commissionAmount,
        updatedAt: new Date(),
      })
      .where(eq(agentWallets.agentId, commission.agentId));
  }
}

export async function getAgentCommissions(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentCommissions)
    .where(eq(agentCommissions.agentId, agentId))
    .orderBy(desc(agentCommissions.createdAt))
    .limit(limit);
}

export async function approveCommission(
  commissionId: string,
  adminId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [commission] = await db
    .select()
    .from(agentCommissions)
    .where(eq(agentCommissions.id, commissionId))
    .limit(1);

  if (!commission) throw new Error("Commission not found");

  await db
    .update(agentCommissions)
    .set({
      status: "approved",
      approvedBy: adminId,
      approvedAt: new Date(),
    })
    .where(eq(agentCommissions.id, commissionId));

  // Move from pending to available balance
  const wallet = await getAgentWallet(commission.agentId);
  if (wallet) {
    await db
      .update(agentWallets)
      .set({
        balance: wallet.balance + commission.commissionAmount,
        pendingBalance: wallet.pendingBalance - commission.commissionAmount,
        totalEarned: wallet.totalEarned + commission.commissionAmount,
        lastTransactionAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agentWallets.agentId, commission.agentId));

    // Log transaction
    await createWalletTransaction({
      id: nanoid(),
      walletId: wallet.id,
      agentId: commission.agentId,
      transactionType: "credit",
      amount: commission.commissionAmount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance + commission.commissionAmount,
      referenceType: "commission",
      referenceId: commissionId,
      description: `Commission approved for booking ${commission.bookingId}`,
      metadata: null,
      createdAt: new Date(),
    });
  }

  // Update referral status
  await db
    .update(agentReferrals)
    .set({ commissionStatus: "approved" })
    .where(eq(agentReferrals.id, commission.referralId));
}

// ============================================
// WALLET
// ============================================

export async function createAgentWallet(wallet: InsertAgentWallet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentWallets).values(wallet);
}

export async function getAgentWallet(agentId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const [wallet] = await db
    .select()
    .from(agentWallets)
    .where(eq(agentWallets.agentId, agentId))
    .limit(1);

  return wallet;
}

export async function createWalletTransaction(
  transaction: InsertAgentWalletTransaction
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentWalletTransactions).values(transaction);
}

export async function getWalletTransactions(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentWalletTransactions)
    .where(eq(agentWalletTransactions.agentId, agentId))
    .orderBy(desc(agentWalletTransactions.createdAt))
    .limit(limit);
}

// ============================================
// WITHDRAWALS
// ============================================

export async function createWithdrawal(withdrawal: InsertAgentWithdrawal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const wallet = await getAgentWallet(withdrawal.agentId);
  if (!wallet) throw new Error("Wallet not found");

  if (wallet.balance < withdrawal.amount) {
    throw new Error("Insufficient balance");
  }

  await db.insert(agentWithdrawals).values(withdrawal);

  // Deduct from balance
  await db
    .update(agentWallets)
    .set({
      balance: wallet.balance - withdrawal.amount,
      updatedAt: new Date(),
    })
    .where(eq(agentWallets.agentId, withdrawal.agentId));

  // Log transaction
  await createWalletTransaction({
    id: nanoid(),
    walletId: wallet.id,
    agentId: withdrawal.agentId,
    transactionType: "withdrawal",
    amount: withdrawal.amount,
    balanceBefore: wallet.balance,
    balanceAfter: wallet.balance - withdrawal.amount,
    referenceType: "withdrawal",
    referenceId: withdrawal.id,
    description: `Withdrawal request to ${withdrawal.bankName}`,
    metadata: null,
    createdAt: new Date(),
  });
}

export async function getAgentWithdrawals(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentWithdrawals)
    .where(eq(agentWithdrawals.agentId, agentId))
    .orderBy(desc(agentWithdrawals.createdAt))
    .limit(limit);
}

export async function getAllPendingWithdrawals() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentWithdrawals)
    .where(eq(agentWithdrawals.status, "pending"))
    .orderBy(desc(agentWithdrawals.createdAt));
}

export async function approveWithdrawal(
  withdrawalId: string,
  adminId: string,
  transactionReference: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [withdrawal] = await db
    .select()
    .from(agentWithdrawals)
    .where(eq(agentWithdrawals.id, withdrawalId))
    .limit(1);

  if (!withdrawal) throw new Error("Withdrawal not found");

  await db
    .update(agentWithdrawals)
    .set({
      status: "completed",
      processedBy: adminId,
      transactionReference,
      processedAt: new Date(),
    })
    .where(eq(agentWithdrawals.id, withdrawalId));

  // Update total withdrawn
  const wallet = await getAgentWallet(withdrawal.agentId);
  if (wallet) {
    await db
      .update(agentWallets)
      .set({
        totalWithdrawn: wallet.totalWithdrawn + withdrawal.amount,
        lastTransactionAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(agentWallets.agentId, withdrawal.agentId));
  }
}

// ============================================
// CUSTOMERS
// ============================================

export async function createAgentCustomer(customer: InsertAgentCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentCustomers).values(customer);
}

export async function getAgentCustomers(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentCustomers)
    .where(eq(agentCustomers.agentId, agentId))
    .orderBy(desc(agentCustomers.createdAt))
    .limit(limit);
}

export async function updateCustomerStatus(
  customerId: string,
  leadStatus: "lead" | "prospect" | "customer" | "inactive"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(agentCustomers)
    .set({ leadStatus, updatedAt: new Date() })
    .where(eq(agentCustomers.id, customerId));
}

// ============================================
// TARGETS
// ============================================

export async function createAgentTarget(target: InsertAgentTarget) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(agentTargets).values(target);
}

export async function getAgentTargets(agentId: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agentTargets)
    .where(eq(agentTargets.agentId, agentId))
    .orderBy(desc(agentTargets.startDate));
}

export async function updateTargetProgress(
  targetId: string,
  currentValue: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [target] = await db
    .select()
    .from(agentTargets)
    .where(eq(agentTargets.id, targetId))
    .limit(1);

  if (!target) return;

  const updates: any = { currentValue };

  if (currentValue >= target.targetValue && target.status === "active") {
    updates.status = "achieved";
    updates.achievedAt = new Date();
  }

  await db.update(agentTargets).set(updates).where(eq(agentTargets.id, targetId));
}

// ============================================
// PRODUCTS (for agent showcase)
// ============================================

export async function getAllProductsForAgent() {
  const db = await getDb();
  if (!db) return { events: [], venues: [], hotels: [], vendors: [] };

  const allEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, "published"))
    .limit(50);

  const allVenues = await db
    .select()
    .from(venues)
    .where(eq(venues.status, "active"))
    .limit(50);

  const allHotels = await db
    .select()
    .from(hotels)
    .where(eq(hotels.status, "active"))
    .limit(50);

  const allVendors = await db
    .select()
    .from(vendors)
    .where(eq(vendors.status, "active"))
    .limit(50);

  return {
    events: allEvents,
    venues: allVenues,
    hotels: allHotels,
    vendors: allVendors,
  };
}

// ============================================
// PERFORMANCE METRICS
// ============================================

export async function getAgentPerformance(agentId: string, days = 30) {
  const db = await getDb();
  if (!db) return null;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get conversions by day
  const dailyConversions = await db
    .select({
      date: sql<string>`DATE(${agentReferrals.convertedAt})`,
      count: count(),
      revenue: sql<number>`SUM(${agentReferrals.conversionValue})`,
      commission: sql<number>`SUM(${agentReferrals.commissionAmount})`,
    })
    .from(agentReferrals)
    .where(
      and(
        eq(agentReferrals.agentId, agentId),
        eq(agentReferrals.conversionStatus, "converted"),
        sql`${agentReferrals.convertedAt} >= ${startDate}`
      )
    )
    .groupBy(sql`DATE(${agentReferrals.convertedAt})`)
    .orderBy(sql`DATE(${agentReferrals.convertedAt})`);

  // Get product type breakdown
  const productBreakdown = await db
    .select({
      productType: agentReferrals.productType,
      count: count(),
      revenue: sql<number>`SUM(${agentReferrals.conversionValue})`,
    })
    .from(agentReferrals)
    .where(
      and(
        eq(agentReferrals.agentId, agentId),
        eq(agentReferrals.conversionStatus, "converted"),
        sql`${agentReferrals.convertedAt} >= ${startDate}`
      )
    )
    .groupBy(agentReferrals.productType);

  return {
    dailyConversions,
    productBreakdown,
  };
}

