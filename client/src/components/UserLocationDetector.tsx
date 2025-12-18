import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle, CheckCircle2, Navigation } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import LocationDetectionProgress from "./LocationDetectionProgress";
import { useEffect, useState } from "react";

interface UserLocationDetectorProps {
  onLocationDetected?: (lat: number, lon: number) => void;
  autoDetect?: boolean;
  showCard?: boolean;
}

export default function UserLocationDetector({
  onLocationDetected,
  autoDetect = false,
  showCard = true,
}: UserLocationDetectorProps) {
  const {
    location,
    error,
    loading,
    isSupported,
    isWatching,
    stage,
    requestLocation,
    startWatching,
    stopWatching,
    clearError,
  } = useGeolocation();

  const [hasRequested, setHasRequested] = useState(false);

  // Auto-detect location on component mount if enabled
  useEffect(() => {
    if (autoDetect && isSupported && !hasRequested) {
      requestLocation();
      setHasRequested(true);
    }
  }, [autoDetect, isSupported, hasRequested, requestLocation]);

  // Notify parent when location is detected
  useEffect(() => {
    if (location) {
      onLocationDetected?.(location.latitude, location.longitude);
    }
  }, [location, onLocationDetected]);

  if (!isSupported) {
    if (showCard) {
      return (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">
                  Geolocation Not Supported
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  Your browser doesn't support location detection. Please update
                  your browser or use a modern browser like Chrome, Firefox, or
                  Safari.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <>
      {showCard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Your Location
            </CardTitle>
            <CardDescription>
              {location
                ? "Location detected - nearby suggestions will be shown"
                : "Allow access to your location for personalized suggestions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Indicator */}
            <LocationDetectionProgress
              stage={stage}
              errorMessage={error}
              onRetry={requestLocation}
            />

            {/* Location Status */}
            {location && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">
                      Location Detected
                    </p>
                    <p className="text-sm text-green-800 mt-1">
                      Latitude: {location.latitude.toFixed(4)}, Longitude:{" "}
                      {location.longitude.toFixed(4)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Accuracy: ±{Math.round(location.accuracy)}m
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2">
              {!location && !isWatching && stage !== "requesting" && stage !== "detecting" && stage !== "processing" && (
                <Button
                  onClick={requestLocation}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Location
                    </>
                  )}
                </Button>
              )}

              {location && !isWatching && (
                <Button
                  onClick={startWatching}
                  variant="outline"
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Real-Time Tracking
                </Button>
              )}

              {isWatching && (
                <Button
                  onClick={stopWatching}
                  variant="destructive"
                  className="w-full"
                >
                  Stop Real-Time Tracking
                </Button>
              )}

              {error && stage === "error" && (
                <Button
                  onClick={clearError}
                  variant="outline"
                  className="w-full"
                >
                  Dismiss Error
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
              <p className="font-medium mb-1">💡 Real-Time Tracking</p>
              <p>
                Enable real-time tracking to get updated location suggestions as
                you move around. Your location is only used for nearby
                suggestions and is not stored.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Mode - Just Button */}
      {!showCard && (
        <Button
          onClick={location && !isWatching ? startWatching : requestLocation}
          disabled={loading}
          variant={location ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
              Detecting...
            </>
          ) : location ? (
            <>
              <Navigation className="h-4 w-4" />
              {isWatching ? "Tracking..." : "Track Location"}
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              Use My Location
            </>
          )}
        </Button>
      )}
    </>
  );
}

