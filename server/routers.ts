import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers-admin";
import { agentRouter } from "./routers-agent";
import { paymentRouter } from "./routers-payment";
import { reviewsRouter } from "./routers-reviews";
import { notificationsRouter, messagingRouter, loyaltyRouter, searchRouter } from "./routers-features";
import { emailRouter } from "./routers-email";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  agent: agentRouter,
  payment: paymentRouter,
  reviews: reviewsRouter,
  notifications: notificationsRouter,
  messaging: messagingRouter,
  loyalty: loyaltyRouter,
  search: searchRouter,
  email: emailRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Events router
  events: router({
    list: publicProcedure.query(async () => {
      const { getEvents } = await import("./db");
      return await getEvents({ status: "published" });
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val) {
        return (val as { id: string }).id;
      }
      throw new Error("Invalid input: expected object with id property");
    }).query(async ({ input }) => {
      const { getEventById } = await import("./db");
      return await getEventById(input);
    }),
    create: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createEvent } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createEvent({
        id: nanoid(),
        organizerId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Venues router
  venues: router({
    list: publicProcedure.query(async () => {
      const { getVenues } = await import("./db");
      return await getVenues();
    }),
    getById: publicProcedure.input((val: unknown) => {
      const obj = val as any;
      if (!obj || typeof obj.id !== "string") throw new Error("Invalid venue ID");
      return obj.id;
    }).query(async ({ input }) => {
      const { getVenueById } = await import("./db");
      return await getVenueById(input);
    }),
    create: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createVenue } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createVenue({
        id: nanoid(),
        ownerId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Hotels router
  hotels: router({
    list: publicProcedure.query(async () => {
      const { getHotels } = await import("./db");
      return await getHotels();
    }),
    getById: publicProcedure.input((val: unknown) => {
      const obj = val as any;
      if (!obj || typeof obj.id !== "string") throw new Error("Invalid hotel ID");
      return obj.id;
    }).query(async ({ input }) => {
      const { getHotelById } = await import("./db");
      return await getHotelById(input);
    }),
    create: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createHotel } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createHotel({
        id: nanoid(),
        ownerId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Bookings router
  bookings: router({
    getById: protectedProcedure.input((val: unknown) => val as any).query(async ({ ctx, input }) => {
      const { getBookingById } = await import("./db");
      const booking = await getBookingById(input.id);
      if (!booking || booking.userId !== ctx.user.id) {
        throw new Error("Booking not found");
      }
      return booking;
    }),
    myBookings: protectedProcedure.query(async ({ ctx }) => {
      const { getUserBookings } = await import("./db");
      return await getUserBookings(ctx.user.id);
    }),
    create: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createBooking } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createBooking({
        id: nanoid(),
        userId: ctx.user.id,
        ...input,
      });
    }),
  }),

  // Vendors router
  vendors: router({
    list: publicProcedure.query(async () => {
      const { getVendors } = await import("./db");
      return await getVendors();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val) {
        return (val as { id: string }).id;
      }
      throw new Error("Invalid input: expected object with id property");
    }).query(async ({ input }) => {
      const { getVendorById } = await import("./db");
      return await getVendorById(input);
    }),
    create: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createVendor } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createVendor({
        id: nanoid(),
        ownerId: ctx.user.id,
        ...input,
      });
    }),
    createBooking: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createVendorBooking } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createVendorBooking({
        id: nanoid(),
        userId: ctx.user.id,
        ...input,
      });
    }),
    myBookings: protectedProcedure.query(async ({ ctx }) => {
      const { getUserVendorBookings } = await import("./db");
      return await getUserVendorBookings(ctx.user.id);
    }),
  }),

  // Dashboard router
  dashboard: router({
    getWishlist: protectedProcedure.query(async ({ ctx }) => {
      const { getUserWishlist } = await import("./db");
      return await getUserWishlist(ctx.user.id);
    }),
    addToWishlist: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { addToWishlist } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await addToWishlist({ id: nanoid(), userId: ctx.user.id, ...input });
    }),
    removeFromWishlist: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ input }) => {
      const { removeFromWishlist } = await import("./db");
      return await removeFromWishlist(input.id);
    }),
    getCart: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCart } = await import("./db");
      return await getUserCart(ctx.user.id);
    }),
    addToCart: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { addToCart } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await addToCart({ id: nanoid(), userId: ctx.user.id, ...input });
    }),
    removeFromCart: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ input }) => {
      const { removeFromCart } = await import("./db");
      return await removeFromCart(input.id);
    }),
    getMyPosts: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPosts } = await import("./db");
      return await getUserPosts(ctx.user.id);
    }),
    getMyLikes: protectedProcedure.query(async ({ ctx }) => {
      const { getUserLikes } = await import("./db");
      return await getUserLikes(ctx.user.id);
    }),
  }),

  // Social router
  social: router({
    posts: publicProcedure.query(async () => {
      const { getPosts } = await import("./db");
      return await getPosts();
    }),
    createPost: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { createPost } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await createPost({
        id: nanoid(),
        userId: ctx.user.id,
        userName: ctx.user.name || "User",
        ...input,
      });
    }),
    getAllPosts: publicProcedure.query(async () => {
      const { getAllPosts } = await import("./db");
      return await getAllPosts();
    }),
    getPartnerPosts: publicProcedure.query(async () => {
      const { getPartnerPosts } = await import("./db");
      return await getPartnerPosts();
    }),
    getPersonalizedFeed: protectedProcedure.query(async ({ ctx }) => {
      const { getPersonalizedFeed } = await import("./db");
      return await getPersonalizedFeed(ctx.user.id);
    }),
    likePost: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { likePost } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await likePost({ id: nanoid(), userId: ctx.user.id, ...input });
    }),
    addComment: protectedProcedure.input((val: unknown) => val as any).mutation(async ({ ctx, input }) => {
      const { addComment } = await import("./db");
      const { nanoid } = await import("nanoid");
      return await addComment({ id: nanoid(), userId: ctx.user.id, userName: ctx.user.name || "User", ...input });
    }),
  }),
});

export type AppRouter = typeof appRouter;
