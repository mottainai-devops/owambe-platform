import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Maximize2 } from "lucide-react";
import { useState } from "react";
import { NIGERIAN_LOCATIONS, Location, getRegions } from "@/lib/locations";

interface LocationMapPickerProps {
  onLocationSelect?: (location: Location) => void;
  selectedLocation?: Location | null;
}

export default function LocationMapPicker({
  onLocationSelect,
  selectedLocation,
}: LocationMapPickerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("Lagos");
  const [isExpanded, setIsExpanded] = useState(false);

  const regions = getRegions();
  const regionLocations = NIGERIAN_LOCATIONS.filter(
    (loc) => loc.region === selectedRegion
  );

  // Calculate map bounds
  const minLat = Math.min(...regionLocations.map((l) => l.latitude)) - 0.5;
  const maxLat = Math.max(...regionLocations.map((l) => l.latitude)) + 0.5;
  const minLon = Math.min(...regionLocations.map((l) => l.longitude)) - 0.5;
  const maxLon = Math.max(...regionLocations.map((l) => l.longitude)) + 0.5;

  const mapWidth = 800;
  const mapHeight = 600;

  const latRange = maxLat - minLat;
  const lonRange = maxLon - minLon;

  // Convert coordinates to pixel positions
  const getPixelPosition = (lat: number, lon: number) => {
    const x = ((lon - minLon) / lonRange) * mapWidth;
    const y = ((maxLat - lat) / latRange) * mapHeight;
    return { x, y };
  };

  const mapContent = (
    <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      <svg
        width={mapWidth}
        height={mapHeight}
        className="w-full h-auto border border-blue-200"
      >
        {/* Grid background */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#e0e7ff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

        {/* Location markers */}
        {regionLocations.map((location) => {
          const { x, y } = getPixelPosition(location.latitude, location.longitude);
          const isSelected = selectedLocation?.id === location.id;

          return (
            <g key={location.id}>
              {/* Circle background */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : 8}
                fill={isSelected ? "#3b82f6" : "#ef4444"}
                opacity={isSelected ? 1 : 0.7}
                className="cursor-pointer hover:opacity-100 transition-all"
                onClick={() => onLocationSelect?.(location)}
              />
              {/* Outer ring for selected */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.3"
                />
              )}
              {/* Label on hover */}
              <title>{location.name}</title>
            </g>
          );
        })}
      </svg>

      {/* Location list overlay */}
      <div className="absolute top-0 right-0 bottom-0 w-64 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-sm mb-2">Locations in {selectedRegion}</h3>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 space-y-2">
          {regionLocations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationSelect?.(location)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedLocation?.id === location.id
                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                  : "hover:bg-gray-100 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-xs text-gray-500">{location.type}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Map View
            </CardTitle>
            <CardDescription>Click on a location to select it</CardDescription>
          </div>
          {!isExpanded && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold">Select Location on Map</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">{mapContent}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">{mapContent}</div>
        )}
      </CardContent>
    </Card>
  );
}

