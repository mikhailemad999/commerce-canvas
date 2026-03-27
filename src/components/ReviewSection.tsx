import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviews } from "@/hooks/use-reviews";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface ReviewSectionProps {
  productId: string;
}

const StarRating = ({
  value,
  onChange,
  interactive = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  interactive?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 transition-colors ${
            interactive ? "cursor-pointer" : ""
          } ${
            i < (hover || value)
              ? "text-gold fill-gold"
              : "text-muted-foreground"
          }`}
          onClick={() => interactive && onChange?.(i + 1)}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
};

const ReviewSection = ({ productId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { reviews, isLoading, submitReview, isSubmitting, userReview } =
    useReviews(productId);
  const [rating, setRating] = useState(userReview?.rating ?? 0);
  const [comment, setComment] = useState(userReview?.comment ?? "");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    submitReview(
      { rating, comment },
      {
        onSuccess: () => setShowForm(false),
      }
    );
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} average
            </span>
          </div>
        )}
      </div>

      {/* Write a review */}
      {user ? (
        !showForm ? (
          <Button
            variant="outline"
            className="mb-6 border-border text-muted-foreground hover:text-gold hover:border-gold"
            onClick={() => {
              setRating(userReview?.rating ?? 0);
              setComment(userReview?.comment ?? "");
              setShowForm(true);
            }}
          >
            {userReview ? "Edit your review" : "Write a review"}
          </Button>
        ) : (
          <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Your rating</p>
            <StarRating value={rating} onChange={setRating} interactive />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="bg-secondary border-border text-foreground"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )
      ) : (
        <p className="text-sm text-muted-foreground mb-6">
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      )}

      {/* Review list */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No reviews yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} />
                  <span className="text-sm font-medium text-foreground">
                    {r.profile?.full_name || "Anonymous"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(r.created_at), "MMM d, yyyy")}
                </span>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
