import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Events table
export const events = mysqlTable("events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["concert", "conference", "wedding", "party", "sports", "festival", "other"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  location: varchar("location", { length: 255 }),
  venueId: varchar("venueId", { length: 64 }),
  organizerId: varchar("organizerId", { length: 64 }).notNull(),
  capacity: int("capacity"),
  price: int("price").notNull(), // in cents
  imageUrl: varchar("imageUrl", { length: 500 }),
  status: mysqlEnum("status", ["draft", "published", "cancelled", "completed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Venues table
export const venues = mysqlTable("venues", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),
  capacity: int("capacity"),
  pricePerDay: int("pricePerDay"), // in cents
  amenities: text("amenities"), // JSON string
  imageUrl: varchar("imageUrl", { length: 500 }),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = typeof venues.$inferInsert;

// Hotels table
export const hotels = mysqlTable("hotels", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),
  starRating: int("starRating"),
  pricePerNight: int("pricePerNight"), // in cents
  amenities: text("amenities"), // JSON string
  imageUrl: varchar("imageUrl", { length: 500 }),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Hotel = typeof hotels.$inferSelect;
export type InsertHotel = typeof hotels.$inferInsert;

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  bookingType: mysqlEnum("bookingType", ["event", "venue", "hotel"]).notNull(),
  referenceId: varchar("referenceId", { length: 64 }).notNull(), // eventId, venueId, or hotelId
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  quantity: int("quantity").default(1),
  totalAmount: int("totalAmount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Payments table
export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  bookingId: varchar("bookingId", { length: 64 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 10 }).default("USD"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Posts table (Social feature)
export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }),
  eventId: varchar("eventId", { length: 64 }), // Optional: link to event
  likesCount: int("likesCount").default(0),
  commentsCount: int("commentsCount").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// Comments table
export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  postId: varchar("postId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// Likes table
export const likes = mysqlTable("likes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  postId: varchar("postId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

// Follows table
export const follows = mysqlTable("follows", {
  id: varchar("id", { length: 64 }).primaryKey(),
  followerId: varchar("followerId", { length: 64 }).notNull(),
  followingId: varchar("followingId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

// B2B Partners table
export const b2bPartners = mysqlTable("b2bPartners", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  businessType: mysqlEnum("businessType", ["venue_owner", "hotel_owner", "event_organizer", "agent"]).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "suspended"]).default("pending").notNull(),
  credits: int("credits").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type B2BPartner = typeof b2bPartners.$inferSelect;
export type InsertB2BPartner = typeof b2bPartners.$inferInsert;

// Discounts table
export const discounts = mysqlTable("discounts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  code: varchar("code", { length: 50 }).notNull(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed"]).notNull(),
  discountValue: int("discountValue").notNull(), // percentage or cents
  minBookingAmount: int("minBookingAmount"), // in cents
  maxDiscountAmount: int("maxDiscountAmount"), // in cents
  applicableType: mysqlEnum("applicableType", ["event", "venue", "hotel", "all"]).notNull(),
  referenceId: varchar("referenceId", { length: 64 }), // specific item or null for all
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  usageLimit: int("usageLimit"),
  usageCount: int("usageCount").default(0),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["active", "inactive", "expired"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Discount = typeof discounts.$inferSelect;
export type InsertDiscount = typeof discounts.$inferInsert;

// Availability Calendar table
export const availability = mysqlTable("availability", {
  id: varchar("id", { length: 64 }).primaryKey(),
  resourceType: mysqlEnum("resourceType", ["venue", "hotel"]).notNull(),
  resourceId: varchar("resourceId", { length: 64 }).notNull(),
  date: timestamp("date").notNull(),
  availableSlots: int("availableSlots").notNull(),
  bookedSlots: int("bookedSlots").default(0),
  price: int("price"), // dynamic pricing in cents
  status: mysqlEnum("status", ["available", "booked", "blocked"]).default("available").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = typeof availability.$inferInsert;

// GDS Distribution Channels table
export const gdsChannels = mysqlTable("gdsChannels", {
  id: varchar("id", { length: 64 }).primaryKey(),
  channelName: varchar("channelName", { length: 100 }).notNull(),
  channelType: mysqlEnum("channelType", ["ota", "gds", "metasearch", "direct"]).notNull(),
  apiEndpoint: varchar("apiEndpoint", { length: 500 }),
  apiKey: varchar("apiKey", { length: 255 }),
  commissionRate: int("commissionRate"), // percentage * 100
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type GDSChannel = typeof gdsChannels.$inferSelect;
export type InsertGDSChannel = typeof gdsChannels.$inferInsert;

// Property Distribution Mapping
export const propertyDistribution = mysqlTable("propertyDistribution", {
  id: varchar("id", { length: 64 }).primaryKey(),
  propertyType: mysqlEnum("propertyType", ["venue", "hotel"]).notNull(),
  propertyId: varchar("propertyId", { length: 64 }).notNull(),
  channelId: varchar("channelId", { length: 64 }).notNull(),
  externalId: varchar("externalId", { length: 255 }), // ID in external system
  syncStatus: mysqlEnum("syncStatus", ["pending", "synced", "failed"]).default("pending").notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type PropertyDistribution = typeof propertyDistribution.$inferSelect;
export type InsertPropertyDistribution = typeof propertyDistribution.$inferInsert;

// Event Vendors table
export const vendors = mysqlTable("vendors", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ownerId: varchar("ownerId", { length: 64 }).notNull(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  vendorType: mysqlEnum("vendorType", ["catering", "photography", "entertainment", "decoration", "planning", "equipment", "security", "transportation", "other"]).notNull(),
  description: text("description"),
  serviceArea: varchar("serviceArea", { length: 255 }), // cities/regions served
  basePrice: int("basePrice"), // starting price in cents
  priceUnit: varchar("priceUnit", { length: 50 }), // per hour, per event, per person, etc
  portfolio: text("portfolio"), // JSON array of image URLs
  offerings: text("offerings"), // JSON array of service packages/options
  perks: text("perks"), // JSON array of special perks/benefits
  rating: int("rating").default(0), // rating * 100 (e.g., 450 = 4.5 stars)
  reviewCount: int("reviewCount").default(0),
  totalBookings: int("totalBookings").default(0),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  verified: int("verified").default(0), // boolean as int
  featured: int("featured").default(0), // boolean as int
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

// Vendor Bookings table (separate from general bookings for vendor-specific data)
export const vendorBookings = mysqlTable("vendorBookings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  vendorId: varchar("vendorId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  eventType: varchar("eventType", { length: 100 }), // wedding, birthday, corporate, etc
  guestCount: int("guestCount"),
  selectedPackage: text("selectedPackage"), // JSON of selected offering
  customRequirements: text("customRequirements"),
  totalAmount: int("totalAmount").notNull(), // in cents
  depositAmount: int("depositAmount"), // in cents
  depositPaid: int("depositPaid").default(0), // boolean as int
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "deposit_paid", "fully_paid", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type VendorBooking = typeof vendorBookings.$inferSelect;
export type InsertVendorBooking = typeof vendorBookings.$inferInsert;

// Vendor Reviews table
export const vendorReviews = mysqlTable("vendorReviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  vendorId: varchar("vendorId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  bookingId: varchar("bookingId", { length: 64 }),
  rating: int("rating").notNull(), // 1-5 stars
  review: text("review"),
  images: text("images"), // JSON array of review image URLs
  response: text("response"), // vendor response to review
  createdAt: timestamp("createdAt").defaultNow(),
});

export type VendorReview = typeof vendorReviews.$inferSelect;
export type InsertVendorReview = typeof vendorReviews.$inferInsert;

// User Interests table
export const userInterests = mysqlTable("userInterests", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // event type, vendor type, etc
  createdAt: timestamp("createdAt").defaultNow(),
});

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = typeof userInterests.$inferInsert;

// Cart table
export const cart = mysqlTable("cart", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  itemType: mysqlEnum("itemType", ["event", "venue", "hotel", "vendor"]).notNull(),
  itemId: varchar("itemId", { length: 64 }).notNull(),
  quantity: int("quantity").default(1),
  selectedOptions: text("selectedOptions"), // JSON for package/options
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Cart = typeof cart.$inferSelect;
export type InsertCart = typeof cart.$inferInsert;

// Wishlist table
export const wishlist = mysqlTable("wishlist", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  itemType: mysqlEnum("itemType", ["event", "venue", "hotel", "vendor"]).notNull(),
  itemId: varchar("itemId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Wishlist = typeof wishlist.$inferSelect;
export type InsertWishlist = typeof wishlist.$inferInsert;

// Partner Posts (for partners to list products/services in community)
export const partnerPosts = mysqlTable("partnerPosts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  partnerId: varchar("partnerId", { length: 64 }).notNull(), // vendor/venue/hotel owner
  partnerType: mysqlEnum("partnerType", ["vendor", "venue", "hotel"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  images: text("images"), // JSON array
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array
  itemType: mysqlEnum("itemType", ["product", "service", "promotion", "announcement"]).notNull(),
  price: int("price"), // in cents, optional
  linkedItemId: varchar("linkedItemId", { length: 64 }), // link to actual vendor/venue/hotel
  likeCount: int("likeCount").default(0),
  commentCount: int("commentCount").default(0),
  viewCount: int("viewCount").default(0),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("published").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PartnerPost = typeof partnerPosts.$inferSelect;
export type InsertPartnerPost = typeof partnerPosts.$inferInsert;


// ============================================
// SUPER ADMIN MODULE
// ============================================

// Admin Users table (separate from regular users for security)
export const admins = mysqlTable("admins", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(), // links to users table
  roleId: varchar("roleId", { length: 64 }).notNull(),
  permissions: text("permissions"), // JSON array of specific permissions
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

// Admin Roles table
export const adminRoles = mysqlTable("adminRoles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  permissions: text("permissions"), // JSON array of permissions
  level: int("level").notNull(), // hierarchy level (1=super, 2=manager, 3=support, etc)
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AdminRole = typeof adminRoles.$inferSelect;
export type InsertAdminRole = typeof adminRoles.$inferInsert;

// Admin Activity Logs (audit trail)
export const adminActivityLogs = mysqlTable("adminActivityLogs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  adminId: varchar("adminId", { length: 64 }).notNull(),
  action: varchar("action", { length: 255 }).notNull(), // e.g., "user_suspended", "partner_approved"
  targetType: varchar("targetType", { length: 50 }), // user, partner, agent, booking, etc
  targetId: varchar("targetId", { length: 64 }),
  details: text("details"), // JSON with additional context
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = typeof adminActivityLogs.$inferInsert;

// Support Tickets table
export const supportTickets = mysqlTable("supportTickets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["booking", "payment", "account", "technical", "other"]).notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  assignedTo: varchar("assignedTo", { length: 64 }), // admin ID
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  resolvedAt: timestamp("resolvedAt"),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

// Ticket Messages table
export const ticketMessages = mysqlTable("ticketMessages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ticketId: varchar("ticketId", { length: 64 }).notNull(),
  senderId: varchar("senderId", { length: 64 }).notNull(),
  senderType: mysqlEnum("senderType", ["user", "admin"]).notNull(),
  message: text("message").notNull(),
  attachments: text("attachments"), // JSON array
  createdAt: timestamp("createdAt").defaultNow(),
});

export type TicketMessage = typeof ticketMessages.$inferSelect;
export type InsertTicketMessage = typeof ticketMessages.$inferInsert;

// Platform Settings table
export const platformSettings = mysqlTable("platformSettings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  settingType: mysqlEnum("settingType", ["string", "number", "boolean", "json"]).notNull(),
  category: varchar("category", { length: 100 }), // general, payment, commission, etc
  description: text("description"),
  updatedBy: varchar("updatedBy", { length: 64 }),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;

// Commission Rates Configuration
export const commissionRates = mysqlTable("commissionRates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  entityType: mysqlEnum("entityType", ["partner", "agent"]).notNull(),
  productType: mysqlEnum("productType", ["event", "venue", "hotel", "vendor", "all"]).notNull(),
  rateType: mysqlEnum("rateType", ["percentage", "fixed"]).notNull(),
  rateValue: int("rateValue").notNull(), // percentage * 100 or cents
  minAmount: int("minAmount"), // minimum transaction amount in cents
  maxAmount: int("maxAmount"), // maximum transaction amount in cents
  tierName: varchar("tierName", { length: 100 }), // e.g., "Standard", "Premium", "VIP"
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  effectiveFrom: timestamp("effectiveFrom").notNull(),
  effectiveTo: timestamp("effectiveTo"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type CommissionRate = typeof commissionRates.$inferSelect;
export type InsertCommissionRate = typeof commissionRates.$inferInsert;

// ============================================
// AGENT MODULE
// ============================================

// Agents table
export const agents = mysqlTable("agents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  agentCode: varchar("agentCode", { length: 50 }).notNull().unique(),
  businessName: varchar("businessName", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  territory: text("territory"), // JSON array of assigned regions/cities
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze").notNull(),
  commissionRate: int("commissionRate"), // override default rate, percentage * 100
  totalSales: int("totalSales").default(0), // in cents
  totalCommission: int("totalCommission").default(0), // in cents
  totalCustomers: int("totalCustomers").default(0),
  rating: int("rating").default(0), // rating * 100
  reviewCount: int("reviewCount").default(0),
  bankName: varchar("bankName", { length: 255 }),
  accountNumber: varchar("accountNumber", { length: 50 }),
  accountName: varchar("accountName", { length: 255 }),
  taxId: varchar("taxId", { length: 100 }),
  status: mysqlEnum("status", ["pending", "active", "suspended", "terminated"]).default("pending").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// Agent Referrals table (tracking referral links and conversions)
export const agentReferrals = mysqlTable("agentReferrals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  referralCode: varchar("referralCode", { length: 100 }).notNull().unique(),
  productType: mysqlEnum("productType", ["event", "venue", "hotel", "vendor", "general"]).notNull(),
  productId: varchar("productId", { length: 64 }), // specific product or null for general
  customerId: varchar("customerId", { length: 64 }), // user who clicked/used referral
  bookingId: varchar("bookingId", { length: 64 }), // resulting booking
  clickCount: int("clickCount").default(0),
  conversionStatus: mysqlEnum("conversionStatus", ["pending", "converted", "cancelled"]).default("pending").notNull(),
  conversionValue: int("conversionValue"), // booking amount in cents
  commissionAmount: int("commissionAmount"), // earned commission in cents
  commissionStatus: mysqlEnum("commissionStatus", ["pending", "approved", "paid", "cancelled"]).default("pending").notNull(),
  metadata: text("metadata"), // JSON with additional tracking data
  createdAt: timestamp("createdAt").defaultNow(),
  convertedAt: timestamp("convertedAt"),
});

export type AgentReferral = typeof agentReferrals.$inferSelect;
export type InsertAgentReferral = typeof agentReferrals.$inferInsert;

// Agent Commissions table (detailed commission records)
export const agentCommissions = mysqlTable("agentCommissions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  referralId: varchar("referralId", { length: 64 }).notNull(),
  bookingId: varchar("bookingId", { length: 64 }).notNull(),
  productType: mysqlEnum("productType", ["event", "venue", "hotel", "vendor"]).notNull(),
  productId: varchar("productId", { length: 64 }).notNull(),
  bookingAmount: int("bookingAmount").notNull(), // in cents
  commissionRate: int("commissionRate").notNull(), // percentage * 100
  commissionAmount: int("commissionAmount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "approved", "paid", "cancelled", "disputed"]).default("pending").notNull(),
  approvedBy: varchar("approvedBy", { length: 64 }), // admin ID
  approvedAt: timestamp("approvedAt"),
  paidAt: timestamp("paidAt"),
  payoutId: varchar("payoutId", { length: 64 }), // reference to payout batch
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AgentCommission = typeof agentCommissions.$inferSelect;
export type InsertAgentCommission = typeof agentCommissions.$inferInsert;

// Agent Wallets table
export const agentWallets = mysqlTable("agentWallets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull().unique(),
  balance: int("balance").default(0), // in cents
  pendingBalance: int("pendingBalance").default(0), // commissions not yet approved
  totalEarned: int("totalEarned").default(0), // lifetime earnings in cents
  totalWithdrawn: int("totalWithdrawn").default(0), // total withdrawn in cents
  currency: varchar("currency", { length: 10 }).default("NGN"),
  lastTransactionAt: timestamp("lastTransactionAt"),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type AgentWallet = typeof agentWallets.$inferSelect;
export type InsertAgentWallet = typeof agentWallets.$inferInsert;

// Agent Wallet Transactions table
export const agentWalletTransactions = mysqlTable("agentWalletTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletId: varchar("walletId", { length: 64 }).notNull(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  transactionType: mysqlEnum("transactionType", ["credit", "debit", "withdrawal", "adjustment"]).notNull(),
  amount: int("amount").notNull(), // in cents
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  referenceType: varchar("referenceType", { length: 50 }), // commission, withdrawal, refund, etc
  referenceId: varchar("referenceId", { length: 64 }),
  description: text("description"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AgentWalletTransaction = typeof agentWalletTransactions.$inferSelect;
export type InsertAgentWalletTransaction = typeof agentWalletTransactions.$inferInsert;

// Agent Withdrawals table
export const agentWithdrawals = mysqlTable("agentWithdrawals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  walletId: varchar("walletId", { length: 64 }).notNull(),
  amount: int("amount").notNull(), // in cents
  bankName: varchar("bankName", { length: 255 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 50 }).notNull(),
  accountName: varchar("accountName", { length: 255 }).notNull(),
  withdrawalMethod: mysqlEnum("withdrawalMethod", ["bank_transfer", "mobile_money", "paypal", "other"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  processedBy: varchar("processedBy", { length: 64 }), // admin ID
  transactionReference: varchar("transactionReference", { length: 255 }),
  failureReason: text("failureReason"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AgentWithdrawal = typeof agentWithdrawals.$inferSelect;
export type InsertAgentWithdrawal = typeof agentWithdrawals.$inferInsert;

// Agent Customers table (leads and customer relationships)
export const agentCustomers = mysqlTable("agentCustomers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  customerId: varchar("customerId", { length: 64 }), // user ID if registered
  customerName: varchar("customerName", { length: 255 }),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 50 }),
  leadStatus: mysqlEnum("leadStatus", ["lead", "prospect", "customer", "inactive"]).default("lead").notNull(),
  leadSource: varchar("leadSource", { length: 100 }), // referral, social, direct, etc
  totalBookings: int("totalBookings").default(0),
  totalSpent: int("totalSpent").default(0), // in cents
  lastContactAt: timestamp("lastContactAt"),
  notes: text("notes"),
  tags: text("tags"), // JSON array
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type AgentCustomer = typeof agentCustomers.$inferSelect;
export type InsertAgentCustomer = typeof agentCustomers.$inferInsert;

// Agent Targets table (sales goals and KPIs)
export const agentTargets = mysqlTable("agentTargets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  targetType: mysqlEnum("targetType", ["sales", "bookings", "customers", "revenue"]).notNull(),
  targetValue: int("targetValue").notNull(),
  currentValue: int("currentValue").default(0),
  period: mysqlEnum("period", ["daily", "weekly", "monthly", "quarterly", "yearly"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  reward: text("reward"), // JSON describing reward for achieving target
  status: mysqlEnum("status", ["active", "achieved", "failed", "cancelled"]).default("active").notNull(),
  achievedAt: timestamp("achievedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type AgentTarget = typeof agentTargets.$inferSelect;
export type InsertAgentTarget = typeof agentTargets.$inferInsert;

// ============================================
// PAYMENT PROCESSING MODULE
// ============================================

// Payment Methods table (saved payment methods for users)
export const paymentMethods = mysqlTable("paymentMethods", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  methodType: mysqlEnum("methodType", ["card", "bank_account", "mobile_money", "wallet"]).notNull(),
  provider: varchar("provider", { length: 100 }), // paystack, flutterwave, stripe
  last4: varchar("last4", { length: 4 }), // last 4 digits of card/account
  brand: varchar("brand", { length: 50 }), // visa, mastercard, verve, etc
  expiryMonth: int("expiryMonth"),
  expiryYear: int("expiryYear"),
  bankName: varchar("bankName", { length: 255 }),
  accountName: varchar("accountName", { length: 255 }),
  isDefault: int("isDefault").default(0), // boolean as int
  token: varchar("token", { length: 255 }), // tokenized reference from payment provider
  metadata: text("metadata"), // JSON with additional provider-specific data
  status: mysqlEnum("status", ["active", "expired", "removed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = typeof paymentMethods.$inferInsert;

// Payment Gateways Configuration
export const paymentGateways = mysqlTable("paymentGateways", {
  id: varchar("id", { length: 64 }).primaryKey(),
  gatewayName: varchar("gatewayName", { length: 100 }).notNull(),
  gatewayType: mysqlEnum("gatewayType", ["paystack", "flutterwave", "stripe", "paypal", "other"]).notNull(),
  publicKey: varchar("publicKey", { length: 255 }),
  secretKey: varchar("secretKey", { length: 255 }),
  webhookSecret: varchar("webhookSecret", { length: 255 }),
  supportedCurrencies: text("supportedCurrencies"), // JSON array
  supportedMethods: text("supportedMethods"), // JSON array (card, bank, ussd, etc)
  isDefault: int("isDefault").default(0), // boolean as int
  priority: int("priority").default(0), // for fallback order
  status: mysqlEnum("status", ["active", "inactive", "testing"]).default("active").notNull(),
  config: text("config"), // JSON with additional configuration
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PaymentGateway = typeof paymentGateways.$inferSelect;
export type InsertPaymentGateway = typeof paymentGateways.$inferInsert;

// Payouts table (for partners and agents)
export const payouts = mysqlTable("payouts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  recipientType: mysqlEnum("recipientType", ["partner", "agent"]).notNull(),
  recipientId: varchar("recipientId", { length: 64 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 10 }).default("NGN"),
  payoutMethod: mysqlEnum("payoutMethod", ["bank_transfer", "mobile_money", "wallet", "paypal"]).notNull(),
  bankName: varchar("bankName", { length: 255 }),
  accountNumber: varchar("accountNumber", { length: 50 }),
  accountName: varchar("accountName", { length: 255 }),
  transactionReference: varchar("transactionReference", { length: 255 }),
  gatewayReference: varchar("gatewayReference", { length: 255 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  processedBy: varchar("processedBy", { length: 64 }), // admin ID
  failureReason: text("failureReason"),
  metadata: text("metadata"), // JSON
  scheduledFor: timestamp("scheduledFor"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;

// Wallet Transactions table (for user/partner/agent wallets)
export const walletTransactions = mysqlTable("walletTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  walletType: mysqlEnum("walletType", ["user", "partner", "agent"]).notNull(),
  walletOwnerId: varchar("walletOwnerId", { length: 64 }).notNull(),
  transactionType: mysqlEnum("transactionType", ["credit", "debit", "refund", "withdrawal", "commission", "adjustment"]).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 10 }).default("NGN"),
  balanceBefore: int("balanceBefore").notNull(),
  balanceAfter: int("balanceAfter").notNull(),
  referenceType: varchar("referenceType", { length: 50 }), // booking, payout, refund, etc
  referenceId: varchar("referenceId", { length: 64 }),
  description: text("description"),
  metadata: text("metadata"), // JSON
  createdAt: timestamp("createdAt").defaultNow(),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = typeof walletTransactions.$inferInsert;

// Refunds table
export const refunds = mysqlTable("refunds", {
  id: varchar("id", { length: 64 }).primaryKey(),
  paymentId: varchar("paymentId", { length: 64 }).notNull(),
  bookingId: varchar("bookingId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 10 }).default("NGN"),
  reason: text("reason"),
  refundMethod: mysqlEnum("refundMethod", ["original_payment", "wallet", "bank_transfer"]).notNull(),
  gatewayReference: varchar("gatewayReference", { length: 255 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "cancelled"]).default("pending").notNull(),
  processedBy: varchar("processedBy", { length: 64 }), // admin ID
  failureReason: text("failureReason"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;

// Payment Disputes table (chargebacks, disputes)
export const paymentDisputes = mysqlTable("paymentDisputes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  paymentId: varchar("paymentId", { length: 64 }).notNull(),
  bookingId: varchar("bookingId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  disputeType: mysqlEnum("disputeType", ["chargeback", "inquiry", "fraud", "other"]).notNull(),
  amount: int("amount").notNull(), // disputed amount in cents
  reason: text("reason"),
  evidence: text("evidence"), // JSON array of evidence documents/links
  gatewayReference: varchar("gatewayReference", { length: 255 }),
  status: mysqlEnum("status", ["open", "under_review", "won", "lost", "closed"]).default("open").notNull(),
  assignedTo: varchar("assignedTo", { length: 64 }), // admin ID
  resolution: text("resolution"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PaymentDispute = typeof paymentDisputes.$inferSelect;
export type InsertPaymentDispute = typeof paymentDisputes.$inferInsert;



// Reviews and Ratings System
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  itemType: mysqlEnum("itemType", ["event", "venue", "hotel", "vendor"]).notNull(),
  itemId: varchar("itemId", { length: 64 }).notNull(),
  bookingId: varchar("bookingId", { length: 64 }),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  pros: text("pros"),
  cons: text("cons"),
  photos: text("photos"), // JSON array of photo URLs
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false),
  helpfulCount: int("helpfulCount").default(0),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  moderatorNotes: text("moderatorNotes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const reviewResponses = mysqlTable("reviewResponses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reviewId: varchar("reviewId", { length: 64 }).notNull(),
  responderId: varchar("responderId", { length: 64 }).notNull(), // Partner/vendor ID
  responderType: mysqlEnum("responderType", ["partner", "vendor", "admin"]).notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const reviewHelpful = mysqlTable("reviewHelpful", {
  id: varchar("id", { length: 64 }).primaryKey(),
  reviewId: varchar("reviewId", { length: 64 }).notNull(),
  userId: varchar("userId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
export type ReviewResponse = typeof reviewResponses.$inferSelect;
export type InsertReviewResponse = typeof reviewResponses.$inferInsert;



// Notifications System
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  type: mysqlEnum("type", ["booking", "payment", "review", "message", "system", "promotion"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("actionUrl", { length: 512 }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const notificationSettings = mysqlTable("notificationSettings", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  emailNotifications: boolean("emailNotifications").default(true),
  smsNotifications: boolean("smsNotifications").default(false),
  pushNotifications: boolean("pushNotifications").default(true),
  bookingUpdates: boolean("bookingUpdates").default(true),
  paymentUpdates: boolean("paymentUpdates").default(true),
  promotions: boolean("promotions").default(true),
  reviews: boolean("reviews").default(true),
  messages: boolean("messages").default(true),
});

// Messaging System
export const conversations = mysqlTable("conversations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  participant1Id: varchar("participant1Id", { length: 64 }).notNull(),
  participant2Id: varchar("participant2Id", { length: 64 }).notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 64 }).primaryKey(),
  conversationId: varchar("conversationId", { length: 64 }).notNull(),
  senderId: varchar("senderId", { length: 64 }).notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Loyalty and Referral Programs
export const loyaltyPoints = mysqlTable("loyaltyPoints", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  points: int("points").default(0),
  tier: mysqlEnum("tier", ["bronze", "silver", "gold", "platinum"]).default("bronze"),
  lifetimePoints: int("lifetimePoints").default(0),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const pointTransactions = mysqlTable("pointTransactions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  points: int("points").notNull(),
  type: mysqlEnum("type", ["earned", "redeemed", "expired"]).notNull(),
  reason: varchar("reason", { length: 255 }),
  referenceId: varchar("referenceId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const userReferrals = mysqlTable("userReferrals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  referrerId: varchar("referrerId", { length: 64 }).notNull(),
  referredUserId: varchar("referredUserId", { length: 64 }),
  referralCode: varchar("referralCode", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed"]).default("pending"),
  rewardPoints: int("rewardPoints").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;

