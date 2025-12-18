import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MapPin } from "lucide-react";
import { useState } from "react";

interface DistanceRadiusSelectorProps {
  onRadiusChange?: (radiusKm: number) => void;
  defaultRadius?: number;
}

const PRESET_DISTANCES = [5, 10, 15, 25, 50, 100];

export default function DistanceRadiusSelector({
  onRadiusChange,
  defaultRadius = 25,
}: DistanceRadiusSelectorProps) {
  const [radius, setRadius] = useState(defaultRadius);

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    onRadiusChange?.(newRadius);
  };

  const handlePresetClick = (distance: number) => {
    setRadius(distance);
    onRadiusChange?.(distance);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Search Radius
        </CardTitle>
        <CardDescription>
          Find results within {radius} km of your selected location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Distance</label>
            <div className="text-2xl font-bold text-blue-600">{radius} km</div>
          </div>

          <Slider
            value={[radius]}
            onValueChange={handleRadiusChange}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div>
          <p className="text-sm font-medium mb-3">Quick Select</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DISTANCES.map((distance) => (
              <button
                key={distance}
                onClick={() => handlePresetClick(distance)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  radius === distance
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {distance} km
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> Smaller radius = closer results. Larger radius = more options.
          </p>
        </div>

        {/* Distance reference */}
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-700">Distance Reference:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• 5 km - Same neighborhood</li>
            <li>• 10 km - Same city area</li>
            <li>• 25 km - City-wide coverage</li>
            <li>• 50 km - Surrounding areas</li>
            <li>• 100 km - Regional coverage</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

