import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MapPin, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Location } from "@/lib/locations";

interface SavedLocationsProps {
  onLocationSelect?: (location: Location) => void;
}

export default function SavedLocations({ onLocationSelect }: SavedLocationsProps) {
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedLocations");
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved locations");
      }
    }
    setIsLoading(false);
  }, []);

  const handleRemove = (id: string) => {
    const updated = savedLocations.filter((loc) => loc.id !== id);
    setSavedLocations(updated);
    localStorage.setItem("savedLocations", JSON.stringify(updated));
  };

  const handleSelect = (location: Location) => {
    onLocationSelect?.(location);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (savedLocations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Saved Locations
          </CardTitle>
          <CardDescription>Save your favorite locations for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No saved locations yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Click the heart icon to save your favorite locations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          Saved Locations ({savedLocations.length})
        </CardTitle>
        <CardDescription>Your favorite destinations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {savedLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <button
                onClick={() => handleSelect(location)}
                className="flex items-start gap-3 flex-1 text-left"
              >
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-500">
                    {location.type === "city" ? "City" : location.type === "landmark" ? "Landmark" : "Area"} • {location.region}
                  </p>
                  {location.description && (
                    <p className="text-xs text-gray-400 mt-1">{location.description}</p>
                  )}
                </div>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(location.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Clear all button */}
        {savedLocations.length > 0 && (
          <Button
            variant="outline"
            className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to clear all saved locations?"
                )
              ) {
                setSavedLocations([]);
                localStorage.removeItem("savedLocations");
              }
            }}
          >
            Clear All
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

