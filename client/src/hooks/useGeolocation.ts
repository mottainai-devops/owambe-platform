import { useState, useEffect, useCallback, useRef } from "react";

export type DetectionStage = "idle" | "requesting" | "detecting" | "processing" | "success" | "error";

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationState {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
  isSupported: boolean;
  isWatching: boolean;
  stage: DetectionStage;
}

/**
 * Custom hook for real-time geolocation tracking with progress stages
 * Uses Browser Geolocation API with watchPosition for continuous updates
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
    isWatching: false,
    stage: "idle",
  });

  const watchIdRef = useRef<number | null>(null);
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Request user's current location (one-time)
   */
  const requestLocation = useCallback(() => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        stage: "error",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, stage: "requesting" }));

    // Simulate permission request stage
    stageTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, stage: "detecting" }));
    }, 1000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setState((prev) => ({ ...prev, stage: "processing" }));

        // Simulate processing stage
        stageTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            location: {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now(),
            },
            loading: false,
            error: null,
            stage: "success",
          }));

          // Auto-reset stage after 2 seconds
          stageTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({
              ...prev,
              stage: "idle",
            }));
          }, 2000);
        }, 800);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Location request timed out. Please try again or check your connection.";
            break;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          stage: "error",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [state.isSupported]);

  /**
   * Start watching user's location in real-time
   */
  const startWatching = useCallback(() => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        stage: "error",
      }));
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    setState((prev) => ({ ...prev, loading: true, error: null, isWatching: true, stage: "detecting" }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setState((prev) => ({
          ...prev,
          location: {
            latitude,
            longitude,
            accuracy,
            timestamp: Date.now(),
          },
          loading: false,
          error: null,
          isWatching: true,
          stage: "success",
        }));
      },
      (error) => {
        let errorMessage = "Failed to watch location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "Location request timed out. Please try again or check your connection.";
            break;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          isWatching: false,
          stage: "error",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [state.isSupported]);

  /**
   * Stop watching user's location
   */
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setState((prev) => ({ ...prev, isWatching: false, stage: "idle" }));
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, stage: "idle" }));
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (stageTimeoutRef.current) {
        clearTimeout(stageTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    requestLocation,
    startWatching,
    stopWatching,
    clearError,
  };
}

