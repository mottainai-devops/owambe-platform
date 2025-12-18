/**
 * Nigerian Cities and Regions Database
 * Includes major cities, landmarks, and areas for location-based filtering
 */

export interface Location {
  id: string;
  name: string;
  type: "city" | "region" | "landmark" | "area";
  region: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export const NIGERIAN_LOCATIONS: Location[] = [
  // Lagos
  {
    id: "lagos-mainland",
    name: "Lagos Mainland",
    type: "area",
    region: "Lagos",
    latitude: 6.5244,
    longitude: 3.3792,
    description: "Central business district",
  },
  {
    id: "victoria-island",
    name: "Victoria Island",
    type: "area",
    region: "Lagos",
    latitude: 6.4281,
    longitude: 3.4281,
    description: "Upscale residential and commercial area",
  },
  {
    id: "lekki",
    name: "Lekki",
    type: "area",
    region: "Lagos",
    latitude: 6.4469,
    longitude: 3.5733,
    description: "Premium residential and entertainment hub",
  },
  {
    id: "ikeja",
    name: "Ikeja",
    type: "area",
    region: "Lagos",
    latitude: 6.5833,
    longitude: 3.35,
    description: "Commercial and administrative center",
  },
  {
    id: "surulere",
    name: "Surulere",
    type: "area",
    region: "Lagos",
    latitude: 6.4833,
    longitude: 3.35,
    description: "Mixed residential and commercial area",
  },
  {
    id: "yaba",
    name: "Yaba",
    type: "area",
    region: "Lagos",
    latitude: 6.5167,
    longitude: 3.3667,
    description: "Educational and cultural hub",
  },
  {
    id: "ikoyi",
    name: "Ikoyi",
    type: "area",
    region: "Lagos",
    latitude: 6.4667,
    longitude: 3.4167,
    description: "Exclusive residential area",
  },
  {
    id: "ajah",
    name: "Ajah",
    type: "area",
    region: "Lagos",
    latitude: 6.4167,
    longitude: 3.6167,
    description: "Emerging residential and commercial area",
  },
  {
    id: "epe",
    name: "Epe",
    type: "area",
    region: "Lagos",
    latitude: 6.5833,
    longitude: 3.9833,
    description: "Coastal town with tourism potential",
  },
  {
    id: "badagry",
    name: "Badagry",
    type: "area",
    region: "Lagos",
    latitude: 6.4833,
    longitude: 2.8833,
    description: "Historic coastal town",
  },
  {
    id: "lagos-city",
    name: "Lagos",
    type: "city",
    region: "Lagos",
    latitude: 6.5244,
    longitude: 3.3792,
    description: "Nigeria's largest city and economic hub",
  },

  // Abuja
  {
    id: "central-business-district",
    name: "Central Business District (CBD)",
    type: "area",
    region: "Abuja",
    latitude: 9.0765,
    longitude: 7.3986,
    description: "Main commercial and administrative center",
  },
  {
    id: "wuse",
    name: "Wuse",
    type: "area",
    region: "Abuja",
    latitude: 9.0833,
    longitude: 7.4167,
    description: "Residential and commercial area",
  },
  {
    id: "maitama",
    name: "Maitama",
    type: "area",
    region: "Abuja",
    latitude: 9.0667,
    longitude: 7.4,
    description: "Upscale residential area",
  },
  {
    id: "garki",
    name: "Garki",
    type: "area",
    region: "Abuja",
    latitude: 9.0667,
    longitude: 7.3833,
    description: "Commercial and residential district",
  },
  {
    id: "asokoro",
    name: "Asokoro",
    type: "area",
    region: "Abuja",
    latitude: 9.0333,
    longitude: 7.4333,
    description: "Diplomatic and exclusive residential area",
  },
  {
    id: "abuja-city",
    name: "Abuja",
    type: "city",
    region: "FCT",
    latitude: 9.0765,
    longitude: 7.3986,
    description: "Nigeria's capital city",
  },

  // Kano
  {
    id: "kano-city",
    name: "Kano",
    type: "city",
    region: "Kano",
    latitude: 12.0022,
    longitude: 8.6753,
    description: "Major commercial hub in Northern Nigeria",
  },
  {
    id: "kano-central",
    name: "Kano Central",
    type: "area",
    region: "Kano",
    latitude: 12.0022,
    longitude: 8.6753,
    description: "City center and commercial area",
  },

  // Ibadan
  {
    id: "ibadan-city",
    name: "Ibadan",
    type: "city",
    region: "Oyo",
    latitude: 7.3775,
    longitude: 3.9470,
    description: "Major city in Southwest Nigeria",
  },
  {
    id: "ibadan-central",
    name: "Ibadan Central",
    type: "area",
    region: "Oyo",
    latitude: 7.3775,
    longitude: 3.9470,
    description: "City center and business district",
  },

  // Port Harcourt
  {
    id: "port-harcourt-city",
    name: "Port Harcourt",
    type: "city",
    region: "Rivers",
    latitude: 4.7711,
    longitude: 7.0534,
    description: "Major oil and gas hub in South-South Nigeria",
  },
  {
    id: "port-harcourt-central",
    name: "Port Harcourt Central",
    type: "area",
    region: "Rivers",
    latitude: 4.7711,
    longitude: 7.0534,
    description: "City center and commercial area",
  },

  // Enugu
  {
    id: "enugu-city",
    name: "Enugu",
    type: "city",
    region: "Enugu",
    latitude: 6.4969,
    longitude: 7.5519,
    description: "Major city in Southeast Nigeria",
  },

  // Calabar
  {
    id: "calabar-city",
    name: "Calabar",
    type: "city",
    region: "Cross River",
    latitude: 4.9531,
    longitude: 8.3670,
    description: "Coastal city known for tourism",
  },

  // Benin City
  {
    id: "benin-city",
    name: "Benin City",
    type: "city",
    region: "Edo",
    latitude: 6.4969,
    longitude: 5.6289,
    description: "Historical city in South-South Nigeria",
  },

  // Akure
  {
    id: "akure-city",
    name: "Akure",
    type: "city",
    region: "Ondo",
    latitude: 7.2500,
    longitude: 5.1833,
    description: "City in Southwest Nigeria",
  },

  // Abeokuta
  {
    id: "abeokuta-city",
    name: "Abeokuta",
    type: "city",
    region: "Ogun",
    latitude: 6.7167,
    longitude: 3.3333,
    description: "City in Southwest Nigeria",
  },

  // Ilorin
  {
    id: "ilorin-city",
    name: "Ilorin",
    type: "city",
    region: "Kwara",
    latitude: 8.4833,
    longitude: 4.5833,
    description: "City in North-Central Nigeria",
  },

  // Landmarks
  {
    id: "lekki-conservation-centre",
    name: "Lekki Conservation Centre",
    type: "landmark",
    region: "Lagos",
    latitude: 6.4469,
    longitude: 3.5733,
    description: "Nature reserve and tourist attraction",
  },
  {
    id: "national-museum",
    name: "National Museum",
    type: "landmark",
    region: "Lagos",
    latitude: 6.4833,
    longitude: 3.4167,
    description: "Cultural and historical museum",
  },
  {
    id: "nike-art-gallery",
    name: "Nike Art Gallery",
    type: "landmark",
    region: "Lagos",
    latitude: 6.5167,
    longitude: 3.3667,
    description: "Contemporary art gallery",
  },
  {
    id: "nnamdi-azikiwe-international-airport",
    name: "Nnamdi Azikiwe International Airport",
    type: "landmark",
    region: "Abuja",
    latitude: 9.0073,
    longitude: 7.2615,
    description: "Major airport in Abuja",
  },
  {
    id: "millennium-park",
    name: "Millennium Park",
    type: "landmark",
    region: "Abuja",
    latitude: 9.0765,
    longitude: 7.3986,
    description: "Public park and recreational area",
  },
];

/**
 * Get all unique regions
 */
export function getRegions(): string[] {
  const regions = new Set(NIGERIAN_LOCATIONS.map((loc) => loc.region));
  return Array.from(regions).sort();
}

/**
 * Get locations by region
 */
export function getLocationsByRegion(region: string): Location[] {
  return NIGERIAN_LOCATIONS.filter((loc) => loc.region === region);
}

/**
 * Search locations by name or description
 */
export function searchLocations(query: string): Location[] {
  const lowerQuery = query.toLowerCase();
  return NIGERIAN_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(lowerQuery) ||
      loc.description?.toLowerCase().includes(lowerQuery) ||
      loc.region.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get locations within a radius
 */
export function getLocationsWithinRadius(
  centerLat: number,
  centerLon: number,
  radiusKm: number
): Location[] {
  return NIGERIAN_LOCATIONS.filter(
    (loc) =>
      calculateDistance(centerLat, centerLon, loc.latitude, loc.longitude) <=
      radiusKm
  );
}

/**
 * Get popular locations (cities and major areas)
 */
export function getPopularLocations(): Location[] {
  return NIGERIAN_LOCATIONS.filter(
    (loc) => loc.type === "city" || loc.type === "landmark"
  ).slice(0, 10);
}

