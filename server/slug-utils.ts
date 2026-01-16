import { db } from "./db";
import { events, venues, hotels, b2bPartners } from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Generate a unique slug for a resource
 * Format: {name}-{city}-{state}
 */
export async function generateUniqueSlug(
  table: 'events' | 'venues' | 'hotels' | 'partners',
  name: string,
  city?: string,
  state?: string,
  excludeId?: string
): Promise<string> {
  let baseSlug = slugify(name);
  
  if (city) baseSlug += `-${slugify(city)}`;
  if (state) baseSlug += `-${slugify(state)}`;
  
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    let query;
    
    switch (table) {
      case 'events':
        query = db.select().from(events).where(eq(events.slug, slug));
        break;
      case 'venues':
        query = db.select().from(venues).where(eq(venues.slug, slug));
        break;
      case 'hotels':
        query = db.select().from(hotels).where(eq(hotels.slug, slug));
        break;
      case 'partners':
        query = db.select().from(b2bPartners).where(eq(b2bPartners.slug, slug));
        break;
    }

    const results = await query;
    
    // If found, check if it's the same record (for updates)
    if (results.length > 0) {
      if (excludeId && results[0].id === excludeId) {
        exists = false; // It's the same record, so slug is valid
      } else {
        // Slug taken, append counter
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    } else {
      exists = false;
    }
  }

  return slug;
}
