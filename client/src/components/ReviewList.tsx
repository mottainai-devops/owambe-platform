import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Star, ThumbsUp, User } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

interface ReviewListProps {
  itemType: "event" | "venue" | "hotel" | "vendor";
  itemId: string;
}

export default function ReviewList({ itemType, itemId }: ReviewListProps) {
  const { user } = useAuth();
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const { data: reviews, isLoading } = trpc.reviews.getByItem.useQuery({
    itemType,
    itemId,
  });

  const markHelpfulMutation = trpc.reviews.markHelpful.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
    },
  });

  const handleMarkHelpful = (reviewId: string) => {
    markHelpfulMutation.mutate({ reviewId });
  };

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No reviews yet. Be the first to review!</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) =>
    reviews.filter((r) => r.rating === rating).length
  );

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">{reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating - 1];
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const isLongReview = (review.comment || "").length > 200;

          return (
            <Card key={review.id}>
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{review.userId}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                )}

                {/* Comment */}
                <p className="text-gray-700 mb-4">
                  {isExpanded || !isLongReview
                    ? review.comment
                    : `${review.comment?.substring(0, 200)}...`}
                </p>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-semibold text-green-900 mb-1">What they liked:</p>
                      <p className="text-sm text-green-800">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm font-semibold text-red-900 mb-1">Could improve:</p>
                      <p className="text-sm text-red-800">{review.cons}</p>
                    </div>
                  )}
                </div>

                {/* Verified Purchase Badge */}
                {review.isVerifiedPurchase && (
                  <div className="mb-4 inline-block bg-blue-50 px-3 py-1 rounded text-sm text-blue-700">
                    ✓ Verified Purchase
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    {isLongReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(review.id)}
                      >
                        {isExpanded ? "Show Less" : "Show More"}
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkHelpful(review.id)}
                    disabled={markHelpfulMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp size={16} />
                    Helpful ({review.helpfulCount || 0})
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

