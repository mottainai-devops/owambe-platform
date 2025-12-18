import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertEvent, events,
  InsertVenue, venues,
  InsertHotel, hotels,
  InsertBooking, bookings,
  InsertPost, posts,
  InsertVendor, vendors,
  InsertVendorBooking, vendorBookings,
  InsertCart, cart,
  InsertWishlist, wishlist,
  InsertPartnerPost, partnerPosts,
  likes,
  comments
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Event queries
export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(events).values(event);
  return event;
}

export async function getEvents(filters?: { category?: string; status?: string }) {
  const db = await getDb();
  if (!db) return [];
  if (filters?.status) {
    return await db.select().from(events).where(eq(events.status, filters.status as any));
  }
  return await db.select().from(events);
}

export async function getEventById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

// Venue queries
export async function createVenue(venue: InsertVenue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(venues).values(venue);
  return venue;
}

export async function getVenues() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(venues).where(eq(venues.status, "active"));
}

export async function getVenueById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(venues).where(eq(venues.id, id)).limit(1);
  return result[0];
}

// Hotel queries
export async function createHotel(hotel: InsertHotel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(hotels).values(hotel);
  return hotel;
}

export async function getHotels() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(hotels).where(eq(hotels.status, "active"));
}

export async function getHotelById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(hotels).where(eq(hotels.id, id)).limit(1);
  return result[0];
}

// Booking queries
export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(bookings).values(booking);
  return booking;
}

export async function getBookingById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserBookings(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bookings).where(eq(bookings.userId, userId));
}

// Social queries
export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(posts).values(post);
  return post;
}

export async function getPosts(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(posts).limit(limit);
}

// Vendor queries
export async function createVendor(vendor: InsertVendor) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vendors).values(vendor);
  return vendor;
}

export async function getVendors(filters?: { vendorType?: string; featured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(vendors).where(eq(vendors.status, "active"));
  if (filters?.vendorType) {
    query = query.where(eq(vendors.vendorType, filters.vendorType as any));
  }
  if (filters?.featured) {
    query = query.where(eq(vendors.featured, 1));
  }
  return await query;
}

export async function getVendorById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
  return result[0];
}

// Vendor Booking queries
export async function createVendorBooking(booking: InsertVendorBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vendorBookings).values(booking);
  return booking;
}

export async function getUserVendorBookings(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vendorBookings).where(eq(vendorBookings.userId, userId));
}

export async function getVendorBookingsByVendor(vendorId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vendorBookings).where(eq(vendorBookings.vendorId, vendorId));
}

// Wishlist queries
export async function getUserWishlist(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
}

export async function addToWishlist(item: InsertWishlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(wishlist).values(item);
  return item;
}

export async function removeFromWishlist(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(wishlist).where(eq(wishlist.id, id));
  return { success: true };
}

// Cart queries
export async function getUserCart(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cart).where(eq(cart.userId, userId));
}

export async function addToCart(item: InsertCart) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cart).values(item);
  return item;
}

export async function removeFromCart(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cart).where(eq(cart.id, id));
  return { success: true };
}

// Social queries
export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(posts).limit(50);
}

export async function getUserPosts(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(posts).where(eq(posts.userId, userId));
}

export async function getUserLikes(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(likes).where(eq(likes.userId, userId));
}

export async function likePost(like: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(likes).values(like);
  return { success: true };
}

export async function addComment(comment: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(comments).values(comment);
  return { success: true };
}

// Partner Posts queries
export async function getPartnerPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(partnerPosts).where(eq(partnerPosts.status, "published")).limit(50);
}

export async function createPartnerPost(post: InsertPartnerPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(partnerPosts).values(post);
  return post;
}

export async function getPersonalizedFeed(userId: string) {
  const db = await getDb();
  if (!db) return [];
  // For now, return all posts and partner posts mixed
  // In production, this would use user interests and ML recommendations
  const userPosts = await db.select().from(posts).limit(25);
  const partnerPostsData = await db.select().from(partnerPosts).where(eq(partnerPosts.status, "published")).limit(25);
  return [...userPosts, ...partnerPostsData].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
