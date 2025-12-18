import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, X, Heart, Clock, Navigation, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  searchLocations,
  getPopularLocations,
  NIGERIAN_LOCATIONS,
  Location,
  calculateDistance,
  getLocationsWithinRadius,
} from "@/lib/locations";
import { useGeolocation } from "@/hooks/useGeolocation";

interface LocationSearchEnhancedProps {
  onLocationSelect?: (location: Location) => void;
  onClose?: () => void;
  selectedLocation?: Location | null;
}

export default function LocationSearchEnhanced({
  onLocationSelect,
  onClose,
  selectedLocation,
}: LocationSearchEnhancedProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [nearbyLocations, setNearbyLocations] = useState<
    (Location & { distance: number })[]
  >([]);
  const [showNearby, setShowNearby] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const { location: userLocation, requestLocation, isWatching } = useGeolocation();

  // Load saved and recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedLocations");
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved locations");
      }
    }

    const recent = localStorage.getItem("recentLocations");
    if (recent) {
      try {
        setRecentLocations(JSON.parse(recent));
      } catch (e) {
        console.error("Failed to load recent locations");
      }
    }
  }, []);

  // Update nearby locations when user location changes
  useEffect(() => {
    if (userLocation) {
      const nearby = getLocationsWithinRadius(
        userLocation.latitude,
        userLocation.longitude,
        25 // 25km radius
      );

      const withDistances = nearby
        .map((loc) => ({
          ...loc,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            loc.latitude,
            loc.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setNearbyLocations(withDistances);
      setShowNearby(true);
    }
  }, [userLocation]);

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      const searchResults = searchLocations(value);
      setResults(searchResults);
      setShowResults(true);
      setShowNearby(false);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  // Handle location selection
  const handleSelectLocation = (location: Location) => {
    onLocationSelect?.(location);

    // Add to recent locations
    const updatedRecent = [
      location,
      ...recentLocations.filter((l) => l.id !== location.id),
    ].slice(0, 5);
    setRecentLocations(updatedRecent);
    localStorage.setItem("recentLocations", JSON.stringify(updatedRecent));

    setQuery("");
    setShowResults(false);
    setShowNearby(false);
  };

  // Handle save location
  const handleSaveLocation = (location: Location, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = savedLocations.some((l) => l.id === location.id);
    let updated;
    if (isSaved) {
      updated = savedLocations.filter((l) => l.id !== location.id);
    } else {
      updated = [...savedLocations, location];
    }
    setSavedLocations(updated);
    localStorage.setItem("savedLocations", JSON.stringify(updated));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        setShowNearby(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSaved = selectedLocation
    ? savedLocations.some((l) => l.id === selectedLocation.id)
    : false;

  const displayResults =
    query.trim().length > 0 ? results : getPopularLocations();

  // Location item component to avoid nested buttons
  const LocationItem = ({
    location,
    isSaved: isLocationSaved,
    distance,
  }: {
    location: Location;
    isSaved: boolean;
    distance?: number;
  }) => (
    <div
      onClick={() => handleSelectLocation(location)}
      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-center justify-between group cursor-pointer"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="flex flex-col items-center gap-1">
          <MapPin className="h-5 w-5 text-blue-600" />
          {distance !== undefined && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
              {distance.toFixed(1)} km
            </span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{location.name}</p>
          <p className="text-sm text-gray-500">
            {location.type === "city"
              ? "City"
              : location.type === "landmark"
              ? "Landmark"
              : "Area"} • {location.region}
          </p>
          {location.description && (
            <p className="text-xs text-gray-400 mt-1">
              {location.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => handleSaveLocation(location, e)}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2 p-1 hover:bg-gray-100 rounded"
        title={isLocationSaved ? "Remove from saved" : "Save location"}
      >
        <Heart
          className={`h-5 w-5 ${
            isLocationSaved
              ? "fill-red-500 text-red-500"
              : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input with Location Button */}
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Where are you going? (City, area, landmark)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (query.trim().length === 0) {
                setShowResults(true);
              }
            }}
            className="pl-10 pr-10 py-2"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setShowResults(false);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Use My Location Button */}
        <Button
          variant={userLocation ? "default" : "outline"}
          size="icon"
          onClick={requestLocation}
          title="Use my current location"
          className="flex-shrink-0"
        >
          <Navigation className={`h-5 w-5 ${isWatching ? "animate-pulse" : ""}`} />
        </Button>
      </div>

      {/* Dropdown Results */}
      {(showResults || showNearby) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Nearby Locations */}
          {showNearby && userLocation && nearbyLocations.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gradient-to-r from-blue-50 to-blue-100 border-b sticky top-0">
                <Navigation className="h-3 w-3 inline mr-1" />
                Nearby Locations ({nearbyLocations.length})
              </div>
              {nearbyLocations.slice(0, 5).map((location) => (
                <LocationItem
                  key={location.id}
                  location={location}
                  isSaved={savedLocations.some((l) => l.id === location.id)}
                  distance={location.distance}
                />
              ))}
            </div>
          )}

          {/* Search Results */}
          {showResults && query.trim().length > 0 && results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                Search Results ({results.length})
              </div>
              {results.map((location) => {
                const distance = userLocation
                  ? calculateDistance(
                      userLocation.latitude,
                      userLocation.longitude,
                      location.latitude,
                      location.longitude
                    )
                  : undefined;

                return (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isSaved={savedLocations.some((l) => l.id === location.id)}
                    distance={distance}
                  />
                );
              })}
            </div>
          )}

          {/* No Results */}
          {showResults && query.trim().length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No locations found for "{query}"</p>
            </div>
          )}

          {/* Saved Locations */}
          {showResults &&
            query.trim().length === 0 &&
            savedLocations.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                  <Heart className="h-3 w-3 inline mr-1" />
                  Saved Locations
                </div>
                {savedLocations.map((location) => (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isSaved={true}
                  />
                ))}
              </div>
            )}

          {/* Recent Locations */}
          {showResults &&
            query.trim().length === 0 &&
            recentLocations.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Recent Searches
                </div>
                {recentLocations.map((location) => (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isSaved={savedLocations.some((l) => l.id === location.id)}
                  />
                ))}
              </div>
            )}

          {/* Popular Locations */}
          {showResults &&
            query.trim().length === 0 &&
            savedLocations.length === 0 &&
            recentLocations.length === 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b sticky top-0">
                  Popular Destinations
                </div>
                {getPopularLocations().map((location) => (
                  <LocationItem
                    key={location.id}
                    location={location}
                    isSaved={savedLocations.some((l) => l.id === location.id)}
                  />
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

