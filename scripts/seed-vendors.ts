import { drizzle } from "drizzle-orm/mysql2";
import { vendors } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const vendorData = [
  {
    id: "vendor_catering_1",
    ownerId: "demo_owner_1",
    businessName: "Royal Catering Services",
    vendorType: "catering" as const,
    description: "Premium catering services for all types of events. From intimate gatherings to grand celebrations, we deliver exceptional culinary experiences with professional service.",
    serviceArea: "Lagos, Abuja, Port Harcourt",
    basePrice: 500000, // ₦5,000 per person
    priceUnit: "per person",
    portfolio: JSON.stringify([
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
    ]),
    offerings: JSON.stringify([
      {
        id: "basic",
        name: "Basic Package",
        description: "Perfect for small gatherings (50-100 guests)",
        price: 500000,
        includes: ["3-course meal", "Soft drinks", "Basic table setup", "2 servers"],
        minGuests: 50,
        maxGuests: 100
      },
      {
        id: "premium",
        name: "Premium Package",
        description: "Ideal for medium events (100-200 guests)",
        price: 750000,
        includes: ["5-course meal", "Premium drinks", "Elegant table setup", "4 servers", "Dessert station"],
        minGuests: 100,
        maxGuests: 200
      },
      {
        id: "luxury",
        name: "Luxury Package",
        description: "Ultimate experience for large events (200+ guests)",
        price: 1200000,
        includes: ["7-course gourmet meal", "Premium bar service", "Luxury table decor", "8 servers", "Live cooking station", "Dessert & cocktail bar"],
        minGuests: 200,
        maxGuests: 500
      }
    ]),
    perks: JSON.stringify([
      "Free tasting session for bookings over ₦500,000",
      "10% discount for early bookings (3+ months advance)",
      "Complimentary cake for weddings",
      "Flexible menu customization",
      "Professional event coordination"
    ]),
    rating: 480, // 4.8 stars
    reviewCount: 127,
    totalBookings: 234,
    contactEmail: "bookings@royalcatering.ng",
    contactPhone: "+234 803 456 7890",
    website: "https://royalcatering.ng",
    verified: 1,
    featured: 1,
    status: "active" as const
  },
  {
    id: "vendor_photography_1",
    ownerId: "demo_owner_2",
    businessName: "Moments Photography Studio",
    vendorType: "photography" as const,
    description: "Award-winning photography and videography services. We capture your special moments with artistic flair and professional excellence.",
    serviceArea: "Lagos, Ibadan, Abeokuta",
    basePrice: 15000000, // ₦150,000
    priceUnit: "per event",
    portfolio: JSON.stringify([
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
    ]),
    offerings: JSON.stringify([
      {
        id: "photo_basic",
        name: "Photography Only",
        description: "Professional photography coverage",
        price: 15000000,
        includes: ["6 hours coverage", "1 photographer", "300+ edited photos", "Online gallery", "USB drive delivery"],
        duration: "6 hours"
      },
      {
        id: "photo_video",
        name: "Photo + Video Package",
        description: "Complete coverage with photos and video",
        price: 30000000,
        includes: ["8 hours coverage", "1 photographer + 1 videographer", "500+ edited photos", "Highlight video (5-7 mins)", "Full ceremony video", "Online gallery", "USB + DVD delivery"],
        duration: "8 hours"
      },
      {
        id: "premium_coverage",
        name: "Premium Full Day",
        description: "Comprehensive all-day coverage",
        price: 50000000,
        includes: ["12 hours coverage", "2 photographers + 2 videographers", "1000+ edited photos", "Cinematic highlight video", "Full event video", "Drone footage", "Same-day slideshow", "Premium album", "Online gallery", "USB + DVD delivery"],
        duration: "12 hours"
      }
    ]),
    perks: JSON.stringify([
      "Free pre-wedding/engagement shoot with premium package",
      "Complimentary photo booth for 4+ hours",
      "20% off on anniversary shoots for past clients",
      "Free prints (20 pcs) with any package",
      "Priority booking for repeat customers"
    ]),
    rating: 495, // 4.95 stars
    reviewCount: 89,
    totalBookings: 156,
    contactEmail: "hello@momentsphotography.ng",
    contactPhone: "+234 805 123 4567",
    website: "https://momentsphotography.ng",
    verified: 1,
    featured: 1,
    status: "active" as const
  },
  {
    id: "vendor_entertainment_1",
    ownerId: "demo_owner_3",
    businessName: "Groove Entertainment",
    vendorType: "entertainment" as const,
    description: "Top-tier entertainment services including DJs, live bands, MCs, and performers. We bring energy and excitement to every event.",
    serviceArea: "Lagos, Ogun, Oyo",
    basePrice: 20000000, // ₦200,000
    priceUnit: "per event",
    portfolio: JSON.stringify([
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800"
    ]),
    offerings: JSON.stringify([
      {
        id: "dj_only",
        name: "DJ Service",
        description: "Professional DJ with premium sound system",
        price: 20000000,
        includes: ["Professional DJ", "Premium sound system", "Lighting setup", "4 hours performance", "Music consultation"],
        duration: "4 hours"
      },
      {
        id: "dj_mc",
        name: "DJ + MC Package",
        description: "Complete entertainment coordination",
        price: 35000000,
        includes: ["Professional DJ", "Experienced MC", "Premium sound & lighting", "6 hours performance", "Event coordination", "Wireless microphones"],
        duration: "6 hours"
      },
      {
        id: "live_band",
        name: "Live Band Performance",
        description: "Live band with full entertainment setup",
        price: 75000000,
        includes: ["6-piece live band", "Professional MC", "Premium sound system", "Stage lighting", "8 hours performance", "Backup DJ", "Event coordination"],
        duration: "8 hours"
      }
    ]),
    perks: JSON.stringify([
      "Free playlist consultation and customization",
      "Complimentary ceremony sound for weddings",
      "15% discount for corporate clients",
      "Free overtime (up to 1 hour) for premium packages",
      "Priority rebooking for annual events"
    ]),
    rating: 470, // 4.7 stars
    reviewCount: 103,
    totalBookings: 189,
    contactEmail: "bookings@grooveentertainment.ng",
    contactPhone: "+234 807 890 1234",
    website: "https://grooveentertainment.ng",
    verified: 1,
    featured: 1,
    status: "active" as const
  },
  {
    id: "vendor_decoration_1",
    ownerId: "demo_owner_4",
    businessName: "Elegant Events Decor",
    vendorType: "decoration" as const,
    description: "Transform your venue into a breathtaking space. Specializing in luxury event decoration with attention to every detail.",
    serviceArea: "Lagos, Abuja",
    basePrice: 25000000, // ₦250,000
    priceUnit: "per event",
    portfolio: JSON.stringify([
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800"
    ]),
    offerings: JSON.stringify([
      {
        id: "basic_decor",
        name: "Essential Decor",
        description: "Beautiful basics for intimate events",
        price: 25000000,
        includes: ["Table centerpieces", "Chair covers & sashes", "Backdrop setup", "Entrance decoration", "Basic lighting"],
        venueSize: "Small (up to 100 guests)"
      },
      {
        id: "premium_decor",
        name: "Premium Decor",
        description: "Elegant styling for memorable events",
        price: 50000000,
        includes: ["Custom centerpieces", "Premium chair covers", "Stage & backdrop design", "Ceiling draping", "Mood lighting", "Entrance arch", "Aisle decoration"],
        venueSize: "Medium (100-250 guests)"
      },
      {
        id: "luxury_decor",
        name: "Luxury Full Decor",
        description: "Spectacular transformation for grand events",
        price: 100000000,
        includes: ["Bespoke floral arrangements", "Luxury linens & covers", "Custom stage design", "Full ceiling treatment", "Designer lighting", "Grand entrance", "Aisle & altar decor", "Lounge areas", "Photo booth backdrop"],
        venueSize: "Large (250+ guests)"
      }
    ]),
    perks: JSON.stringify([
      "Free venue consultation and 3D mockup",
      "10% discount for off-peak dates (weekdays)",
      "Complimentary cake table decoration",
      "Free setup and breakdown",
      "Flexible payment plans available"
    ]),
    rating: 485, // 4.85 stars
    reviewCount: 76,
    totalBookings: 142,
    contactEmail: "info@elegantevents.ng",
    contactPhone: "+234 809 234 5678",
    website: "https://elegantevents.ng",
    verified: 1,
    featured: 1,
    status: "active" as const
  },
  {
    id: "vendor_planning_1",
    ownerId: "demo_owner_5",
    businessName: "Perfect Day Planners",
    vendorType: "planning" as const,
    description: "Full-service event planning and coordination. We handle every detail so you can enjoy your special day stress-free.",
    serviceArea: "Lagos, Abuja, Port Harcourt, Calabar",
    basePrice: 50000000, // ₦500,000
    priceUnit: "per event",
    portfolio: JSON.stringify([
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800"
    ]),
    offerings: JSON.stringify([
      {
        id: "coordination_only",
        name: "Day-of Coordination",
        description: "Professional coordination on your event day",
        price: 50000000,
        includes: ["Event day coordination", "Vendor management", "Timeline creation", "Setup supervision", "Problem solving", "2 coordinators"],
        timeline: "Event day only"
      },
      {
        id: "partial_planning",
        name: "Partial Planning",
        description: "Planning assistance for key elements",
        price: 100000000,
        includes: ["Vendor recommendations", "Budget planning", "Design consultation", "Contract review", "Timeline management", "Day-of coordination", "3 planning meetings"],
        timeline: "2-3 months planning"
      },
      {
        id: "full_planning",
        name: "Full-Service Planning",
        description: "Complete planning from start to finish",
        price: 200000000,
        includes: ["Complete event planning", "Unlimited vendor sourcing", "Budget management", "Design & styling", "All contract negotiations", "RSVP management", "Rehearsal coordination", "Full day-of coordination", "Unlimited meetings", "Emergency kit"],
        timeline: "6+ months planning"
      }
    ]),
    perks: JSON.stringify([
      "Free initial consultation (1 hour)",
      "Access to exclusive vendor network with discounts",
      "Complimentary wedding website setup",
      "Free guest list management tools",
      "Post-event vendor payment coordination",
      "Priority support 24/7 during planning period"
    ]),
    rating: 490, // 4.9 stars
    reviewCount: 64,
    totalBookings: 98,
    contactEmail: "hello@perfectdayplanners.ng",
    contactPhone: "+234 810 345 6789",
    website: "https://perfectdayplanners.ng",
    verified: 1,
    featured: 1,
    status: "active" as const
  }
];

async function seedVendors() {
  console.log("Seeding vendors...");
  
  for (const vendor of vendorData) {
    await db.insert(vendors).values(vendor).onDuplicateKeyUpdate({ set: { id: vendor.id } });
    console.log(`✓ Added ${vendor.businessName}`);
  }
  
  console.log("\n✅ Vendor seeding complete!");
  console.log(`Total vendors: ${vendorData.length}`);
  process.exit(0);
}

seedVendors().catch((error) => {
  console.error("Error seeding vendors:", error);
  process.exit(1);
});

