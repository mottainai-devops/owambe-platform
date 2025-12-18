import { Loader, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

export type LoadingAnimationType = "spinner" | "pulse" | "dots" | "compass" | "wave";
export type LoadingState = "loading" | "success" | "error" | "idle";

interface LoadingAnimationProps {
  type?: LoadingAnimationType;
  state?: LoadingState;
  message?: string;
  size?: "sm" | "md" | "lg";
  showMessage?: boolean;
}

export default function LoadingAnimation({
  type = "spinner",
  state = "loading",
  message = "Loading...",
  size = "md",
  showMessage = true,
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Spinner Animation
  if (type === "spinner") {
    return (
      <div className="flex flex-col items-center gap-2">
        {state === "loading" && (
          <Loader className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        )}
        {state === "success" && (
          <CheckCircle2 className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
        )}
        {state === "error" && (
          <AlertCircle className={`${sizeClasses[size]} text-red-600 animate-pulse`} />
        )}
        {showMessage && message && (
          <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Pulse Animation
  if (type === "pulse") {
    return (
      <div className="flex flex-col items-center gap-2">
        {state === "loading" && (
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`} />
            <div className={`${sizeClasses[size]} absolute top-0 left-0 bg-blue-400 rounded-full animate-ping`} />
          </div>
        )}
        {state === "success" && (
          <CheckCircle2 className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
        )}
        {state === "error" && (
          <AlertCircle className={`${sizeClasses[size]} text-red-600 animate-pulse`} />
        )}
        {showMessage && message && (
          <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Dots Animation
  if (type === "dots") {
    return (
      <div className="flex flex-col items-center gap-2">
        {state === "loading" && (
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        {state === "success" && (
          <CheckCircle2 className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
        )}
        {state === "error" && (
          <AlertCircle className={`${sizeClasses[size]} text-red-600 animate-pulse`} />
        )}
        {showMessage && message && (
          <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Compass Animation (GPS themed)
  if (type === "compass") {
    return (
      <div className="flex flex-col items-center gap-2">
        {state === "loading" && (
          <div className="relative">
            <MapPin className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-1 bg-blue-600 rounded-full animate-pulse" />
            </div>
          </div>
        )}
        {state === "success" && (
          <CheckCircle2 className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
        )}
        {state === "error" && (
          <AlertCircle className={`${sizeClasses[size]} text-red-600 animate-pulse`} />
        )}
        {showMessage && message && (
          <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  // Wave Animation
  if (type === "wave") {
    return (
      <div className="flex flex-col items-center gap-2">
        {state === "loading" && (
          <div className="flex items-center gap-1">
            <div
              className="h-3 w-1 bg-blue-600 rounded-full"
              style={{
                animation: "wave 1.2s ease-in-out infinite",
                animationDelay: "0s",
              }}
            />
            <div
              className="h-4 w-1 bg-blue-600 rounded-full"
              style={{
                animation: "wave 1.2s ease-in-out infinite",
                animationDelay: "0.2s",
              }}
            />
            <div
              className="h-5 w-1 bg-blue-600 rounded-full"
              style={{
                animation: "wave 1.2s ease-in-out infinite",
                animationDelay: "0.4s",
              }}
            />
            <div
              className="h-4 w-1 bg-blue-600 rounded-full"
              style={{
                animation: "wave 1.2s ease-in-out infinite",
                animationDelay: "0.6s",
              }}
            />
            <div
              className="h-3 w-1 bg-blue-600 rounded-full"
              style={{
                animation: "wave 1.2s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
            />
          </div>
        )}
        {state === "success" && (
          <CheckCircle2 className={`${sizeClasses[size]} text-green-600 animate-bounce`} />
        )}
        {state === "error" && (
          <AlertCircle className={`${sizeClasses[size]} text-red-600 animate-pulse`} />
        )}
        {showMessage && message && (
          <span className={`${textSizeClasses[size]} font-medium text-gray-700`}>
            {message}
          </span>
        )}
        <style>{`
          @keyframes wave {
            0%, 100% {
              transform: scaleY(0.5);
              opacity: 0.5;
            }
            50% {
              transform: scaleY(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

