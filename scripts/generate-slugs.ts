import { db } from "../server/db";
import { events, venues, hotels, b2bPartners } from "../drizzle/schema";
import { generateUniqueSlug } from "../server/slug-utils";
import { eq, isNull } from "drizzle-orm";

async function main() {
  console.log("Starting bulk slug generation...");

  // 1. Events
  const eventsList = await db.select().from(events).where(isNull(events.slug));
  console.log(`Found ${eventsList.length} events without slugs.`);
  
  for (const item of eventsList) {
    const slug = await generateUniqueSlug('events', item.title, item.location || undefined);
    await db.update(events).set({ slug }).where(eq(events.id, item.id));
    console.log(`Updated event: ${item.title} -> ${slug}`);
  }

  // 2. Venues
  const venuesList = await db.select().from(venues).where(isNull(venues.slug));
  console.log(`Found ${venuesList.length} venues without slugs.`);
  
  for (const item of venuesList) {
    const slug = await generateUniqueSlug('venues', item.name, item.city, item.state || undefined);
    await db.update(venues).set({ slug }).where(eq(venues.id, item.id));
    console.log(`Updated venue: ${item.name} -> ${slug}`);
  }

  // 3. Hotels
  const hotelsList = await db.select().from(hotels).where(isNull(hotels.slug));
  console.log(`Found ${hotelsList.length} hotels without slugs.`);
  
  for (const item of hotelsList) {
    const slug = await generateUniqueSlug('hotels', item.name, item.city, item.state || undefined);
    await db.update(hotels).set({ slug }).where(eq(hotels.id, item.id));
    console.log(`Updated hotel: ${item.name} -> ${slug}`);
  }

  // 4. Partners
  const partnersList = await db.select().from(b2bPartners).where(isNull(b2bPartners.slug));
  console.log(`Found ${partnersList.length} partners without slugs.`);
  
  for (const item of partnersList) {
    const slug = await generateUniqueSlug('partners', item.companyName);
    await db.update(b2bPartners).set({ slug }).where(eq(b2bPartners.id, item.id));
    console.log(`Updated partner: ${item.companyName} -> ${slug}`);
  }

  console.log("Slug generation complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
