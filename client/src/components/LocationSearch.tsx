import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, X, Heart, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  searchLocations,
  getPopularLocations,
  NIGERIAN_LOCATIONS,
  Location,
} from "@/lib/locations";

interface LocationSearchProps {
  onLocationSelect?: (location: Location) => void;
  onClose?: () => void;
  selectedLocation?: Location | null;
}

export default function LocationSearch({
  onLocationSelect,
  onClose,
  selectedLocation,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      const searchResults = searchLocations(value);
      setResults(searchResults);
      setShowResults(true);
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

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Where are you going? (City, area, landmark)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
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

      {/* Dropdown Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {query.trim().length > 0 && results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                Search Results ({results.length})
              </div>
              {results.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">
                        {location.type === "city" ? "City" : location.type === "landmark" ? "Landmark" : "Area"} • {location.region}
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        savedLocations.some((l) => l.id === location.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No locations found for "{query}"</p>
            </div>
          )}

          {/* Saved Locations */}
          {query.trim().length === 0 && savedLocations.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                <Heart className="h-3 w-3 inline mr-1" />
                Saved Locations
              </div>
              {savedLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">{location.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleSaveLocation(location, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Recent Locations */}
          {query.trim().length === 0 && recentLocations.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                <Clock className="h-3 w-3 inline mr-1" />
                Recent Searches
              </div>
              {recentLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">{location.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleSaveLocation(location, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        savedLocations.some((l) => l.id === location.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Popular Locations */}
          {query.trim().length === 0 &&
            savedLocations.length === 0 &&
            recentLocations.length === 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
                  Popular Destinations
                </div>
                {getPopularLocations().map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {location.name}
                        </p>
                        <p className="text-sm text-gray-500">{location.region}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleSaveLocation(location, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-5 w-5 text-gray-400" />
                    </button>
                  </button>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

