import { MapPin, CheckCircle2, AlertCircle, Loader } from "lucide-react";
import LoadingAnimation from "./LoadingAnimation";

export type DetectionStage = "idle" | "requesting" | "detecting" | "processing" | "success" | "error";

interface LocationDetectionProgressProps {
  stage: DetectionStage;
  errorMessage?: string;
  onRetry?: () => void;
}

const stageConfig = {
  idle: {
    icon: MapPin,
    message: "Ready to detect your location",
    color: "text-gray-400",
    bgColor: "bg-gray-50",
  },
  requesting: {
    icon: Loader,
    message: "Requesting location permission...",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  detecting: {
    icon: Loader,
    message: "Detecting your location...",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  processing: {
    icon: Loader,
    message: "Finding nearby suggestions...",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  success: {
    icon: CheckCircle2,
    message: "Location detected successfully!",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  error: {
    icon: AlertCircle,
    message: "Failed to detect location",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export default function LocationDetectionProgress({
  stage,
  errorMessage,
  onRetry,
}: LocationDetectionProgressProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border ${config.bgColor} p-4`}>
      <div className="flex items-start gap-3">
        {stage === "requesting" || stage === "detecting" || stage === "processing" ? (
          <div className="mt-0.5">
            <LoadingAnimation
              type="compass"
              state="loading"
              size="sm"
              showMessage={false}
            />
          </div>
        ) : stage === "success" ? (
          <Icon className={`h-5 w-5 ${config.color} mt-0.5 animate-bounce`} />
        ) : stage === "error" ? (
          <Icon className={`h-5 w-5 ${config.color} mt-0.5 animate-pulse`} />
        ) : (
          <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
        )}

        <div className="flex-1">
          <p className={`font-medium ${config.color}`}>{config.message}</p>
          {errorMessage && stage === "error" && (
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          )}
        </div>

        {stage === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-600 hover:text-red-700 whitespace-nowrap ml-2"
          >
            Retry
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            stage === "idle"
              ? "w-0 bg-gray-400"
              : stage === "requesting"
              ? "w-1/4 bg-blue-600"
              : stage === "detecting"
              ? "w-1/2 bg-blue-600"
              : stage === "processing"
              ? "w-3/4 bg-purple-600"
              : stage === "success"
              ? "w-full bg-green-600"
              : "w-full bg-red-600"
          }`}
        />
      </div>

      {/* Stage Description */}
      <p className="text-xs text-gray-500 mt-2">
        {stage === "idle" && "Click 'Use My Location' to get started"}
        {stage === "requesting" && "Please allow location access in your browser"}
        {stage === "detecting" && "Acquiring GPS coordinates..."}
        {stage === "processing" && "Loading nearby locations..."}
        {stage === "success" && "You can now see nearby suggestions"}
        {stage === "error" && "Please check your browser settings or try again"}
      </p>
    </div>
  );
}

