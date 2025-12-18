import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function RatingDisplay({
  rating,
  reviewCount,
  size = "md",
  showText = true,
}: RatingDisplayProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const starSize = sizeMap[size];
  const displayRating = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={`${
              star <= Math.round(displayRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showText && (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{displayRating}</span>
          {reviewCount !== undefined && (
            <span className="text-sm text-gray-600">({reviewCount})</span>
          )}
        </div>
      )}
    </div>
  );
}

