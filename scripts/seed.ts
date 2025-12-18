import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/mysql2";
import { events, venues, hotels, posts } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database...");

  // Sample venues
  const venueData = [
    {
      id: nanoid(),
      name: "Grand Ballroom Lagos",
      description: "Luxurious ballroom perfect for weddings and corporate events. Features state-of-the-art lighting and sound systems.",
      address: "123 Victoria Island Road",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      capacity: 500,
      pricePerDay: 150000, // 1500 USD in cents
      amenities: JSON.stringify(["WiFi", "Parking", "Catering", "AV Equipment", "Air Conditioning"]),
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800",
      ownerId: "system",
      status: "active" as const,
    },
    {
      id: nanoid(),
      name: "Skyline Convention Center",
      description: "Modern convention center with panoramic city views. Ideal for conferences and exhibitions.",
      address: "45 Lekki Phase 1",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      capacity: 1000,
      pricePerDay: 250000,
      amenities: JSON.stringify(["WiFi", "Parking", "Exhibition Space", "Multiple Rooms", "Restaurant"]),
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      ownerId: "system",
      status: "active" as const,
    },
    {
      id: nanoid(),
      name: "Garden Paradise Venue",
      description: "Beautiful outdoor venue surrounded by lush gardens. Perfect for intimate weddings and garden parties.",
      address: "78 Ikoyi Crescent",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      capacity: 200,
      pricePerDay: 100000,
      amenities: JSON.stringify(["Garden", "Parking", "Outdoor Seating", "Photography Spots", "Catering Kitchen"]),
      imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      ownerId: "system",
      status: "active" as const,
    },
  ];

  // Sample hotels
  const hotelData = [
    {
      id: nanoid(),
      name: "Royal Palm Hotel",
      description: "5-star luxury hotel with world-class amenities and exceptional service.",
      address: "12 Adeola Odeku Street",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      starRating: 5,
      pricePerNight: 45000,
      amenities: JSON.stringify(["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service"]),
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      ownerId: "system",
      status: "active" as const,
    },
    {
      id: nanoid(),
      name: "Business Hub Hotel",
      description: "Modern business hotel with excellent conference facilities and convenient location.",
      address: "34 Admiralty Way",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      starRating: 4,
      pricePerNight: 28000,
      amenities: JSON.stringify(["WiFi", "Business Center", "Meeting Rooms", "Gym", "Restaurant"]),
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      ownerId: "system",
      status: "active" as const,
    },
    {
      id: nanoid(),
      name: "Coastal View Resort",
      description: "Beachfront resort offering stunning ocean views and relaxing atmosphere.",
      address: "56 Beach Road",
      city: "Lagos",
      state: "Lagos State",
      country: "Nigeria",
      starRating: 4,
      pricePerNight: 35000,
      amenities: JSON.stringify(["WiFi", "Beach Access", "Pool", "Restaurant", "Water Sports", "Spa"]),
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      ownerId: "system",
      status: "active" as const,
    },
  ];

  // Sample events
  const eventData = [
    {
      id: nanoid(),
      title: "Lagos Tech Summit 2025",
      description: "The biggest technology conference in West Africa. Join industry leaders, innovators, and entrepreneurs for three days of insights, networking, and innovation.",
      category: "conference" as const,
      startDate: new Date("2025-11-15T09:00:00"),
      endDate: new Date("2025-11-17T18:00:00"),
      location: "Skyline Convention Center, Lagos",
      venueId: venueData[1].id,
      organizerId: "system",
      capacity: 800,
      price: 25000,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Afrobeat Music Festival",
      description: "Experience the best of Afrobeat music with top artists from across Africa. A night of rhythm, dance, and celebration.",
      category: "concert" as const,
      startDate: new Date("2025-12-20T19:00:00"),
      endDate: new Date("2025-12-20T23:00:00"),
      location: "Grand Ballroom Lagos",
      venueId: venueData[0].id,
      organizerId: "system",
      capacity: 500,
      price: 15000,
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Wedding Expo 2025",
      description: "Discover the latest trends in weddings, meet top vendors, and plan your perfect day. Free entry for couples.",
      category: "wedding" as const,
      startDate: new Date("2025-11-01T10:00:00"),
      endDate: new Date("2025-11-01T18:00:00"),
      location: "Garden Paradise Venue, Lagos",
      venueId: venueData[2].id,
      organizerId: "system",
      capacity: 200,
      price: 0,
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "New Year's Eve Gala",
      description: "Ring in the new year with style! Elegant gala dinner, live entertainment, and spectacular fireworks display.",
      category: "party" as const,
      startDate: new Date("2025-12-31T20:00:00"),
      endDate: new Date("2026-01-01T02:00:00"),
      location: "Royal Palm Hotel, Lagos",
      organizerId: "system",
      capacity: 300,
      price: 50000,
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Lagos Marathon 2025",
      description: "Join thousands of runners in Africa's premier marathon event. Full marathon, half marathon, and 10K races available.",
      category: "sports" as const,
      startDate: new Date("2025-11-25T06:00:00"),
      endDate: new Date("2025-11-25T14:00:00"),
      location: "Lagos Island Start Point",
      organizerId: "system",
      capacity: 5000,
      price: 5000,
      imageUrl: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
      status: "published" as const,
    },
    {
      id: nanoid(),
      title: "Food & Wine Festival",
      description: "Celebrate culinary excellence with renowned chefs, wine tastings, and gourmet experiences from around the world.",
      category: "festival" as const,
      startDate: new Date("2025-12-10T12:00:00"),
      endDate: new Date("2025-12-12T22:00:00"),
      location: "Coastal View Resort, Lagos",
      organizerId: "system",
      capacity: 400,
      price: 20000,
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      status: "published" as const,
    },
  ];

  // Sample posts
  const postData = [
    {
      id: nanoid(),
      userId: "system",
      content: "Just attended the Lagos Tech Summit and it was amazing! The keynote on AI and blockchain was mind-blowing. Can't wait for next year! 🚀 #TechSummit #Lagos",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      eventId: eventData[0].id,
      likesCount: 45,
      commentsCount: 12,
    },
    {
      id: nanoid(),
      userId: "system",
      content: "The Afrobeat Music Festival was absolutely incredible! The energy, the music, the vibes - everything was perfect. Already got my tickets for next year! 🎵🎉",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      eventId: eventData[1].id,
      likesCount: 89,
      commentsCount: 23,
    },
    {
      id: nanoid(),
      userId: "system",
      content: "Found the perfect venue for our wedding at the Wedding Expo! Garden Paradise Venue is absolutely stunning. Thank you Owambe for making planning so easy! 💍✨",
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=800",
      likesCount: 156,
      commentsCount: 34,
    },
  ];

  try {
    // Insert venues
    console.log("📍 Adding venues...");
    await db.insert(venues).values(venueData);
    console.log(`✅ Added ${venueData.length} venues`);

    // Insert hotels
    console.log("🏨 Adding hotels...");
    await db.insert(hotels).values(hotelData);
    console.log(`✅ Added ${hotelData.length} hotels`);

    // Insert events
    console.log("🎉 Adding events...");
    await db.insert(events).values(eventData);
    console.log(`✅ Added ${eventData.length} events`);

    // Insert posts
    console.log("💬 Adding social posts...");
    await db.insert(posts).values(postData);
    console.log(`✅ Added ${postData.length} posts`);

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("🎊 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });

