"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Review } from "@/types";
import { userProfileImage } from "@/assets";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface ReviewListProps {
  type: "doctor" | "pharmacy" | "medicine";
  entityId: number;
  fetchReviews: (id: number) => Promise<Review[]>;
  deleteReview: (id: number) => Promise<{ message: string }>;
}

export default function ReviewList({
  type,
  entityId,
  fetchReviews,
  deleteReview,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchReviews(entityId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Failed to fetch reviews for ${type}:`, error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (entityId) {
      loadReviews();
    }
  }, [type, entityId, fetchReviews]);

  const handleDeleteClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(reviewToDelete);
      await deleteReview(reviewToDelete);
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      setReviewToDelete(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 bg-white rounded-3xl border border-gray-100">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
          <Star className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
        <p className="text-gray-500">There are no patient reviews for this {type} yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => {
          const author = review.user;
          const reviewImageUrl = author?.profileImage || userProfileImage;

          return (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14">
                    <Image
                      src={reviewImageUrl}
                      fill
                      alt={author?.userName || "User"}
                      className="rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-lg px-1 py-0.5 flex items-center gap-0.5 text-[10px] font-bold shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {review.rating}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{author?.userName || "Anonymous"}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-200 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(review.id)}
                  disabled={isDeleting === review.id}
                  className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl h-10 w-10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete review"
                >
                  <Trash2 className={`w-4.5 h-4.5 ${isDeleting === review.id ? "animate-pulse" : ""}`} />
                </Button>
              </div>
              
              <div className="flex-1 text-gray-600 text-sm leading-relaxed italic font-medium">
                  &quot;{review.comment}&quot;
              </div>

              <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                  {type === 'medicine' ? 'Medication Feedback' : 'Patient Feedback'}
                </span>
                {author?.address && (
                  <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                     {author.address}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        variant="destructive"
        isLoading={isDeleting !== null}
      />
    </div>
  );
}
