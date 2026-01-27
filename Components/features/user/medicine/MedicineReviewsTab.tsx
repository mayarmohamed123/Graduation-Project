"use client";

import { useState, useMemo } from "react";
import { Review } from "@/types";
import { Star, MessageCircle, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";
import MedicineReviewDialog from "./MedicineReviewDialog";
// Touched to refresh IDE state

interface MedicineReviewsTabProps {
  medicineId: number;
  reviews: Review[];
  averageRating: number;
  onRefresh: () => void;
}

export default function MedicineReviewsTab({
  medicineId,
  reviews,
  averageRating,
  onRefresh,
}: MedicineReviewsTabProps) {
  const { user } = useUser();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const rating = Math.round(r.rating);
      if (rating >= 1 && rating <= 5) counts[5 - rating]++;
    });
    return counts.map(count => ({
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
    }));
  }, [reviews]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await pharmacyService.deleteReview(deletingId);
      toast.success("Review deleted successfully");
      onRefresh();
    } catch (err) {
      toast.error("Failed to delete review");
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reviews Summary Section */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Main Average Review */}
          <div className="text-center lg:border-r border-gray-100 lg:pr-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</h3>
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-500 font-medium">{reviews.length} reviews</p>
          </div>

          {/* Detailed Star Distribution */}
          <div className="flex-1 space-y-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-600 w-4">{5 - idx}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2BBBC5] rounded-full" 
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-400 w-10 text-right">
                    {Math.round(stat.percentage)}%
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setEditingReview(null);
                setIsDialogOpen(true);
              }}
              className="bg-[#2BBBC5] hover:bg-[#25a0a9] text-white px-8 py-6 rounded-2xl font-bold transition-all shadow-lg shadow-teal-100 flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Write a Review
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => {
          const author = review.user;
          const isAuthor = user?.id === author?.id;

          return (
            <div
              key={review.id}
              className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex gap-4">
                <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-gray-50 focus-within:ring-primary/20">
                  <AvatarImage 
                    src={author?.profileImage || ""} 
                    alt={author?.userName || "User"}
                  />
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    {author?.userName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {author?.userName || "Anonymous"}
                      </h4>
                      <p className="text-xs font-bold text-[#2BBBC5] uppercase tracking-wider">
                        Verified Buyer
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed font-medium">
                    {review.comment}
                  </p>

                  {isAuthor && (
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-50">
                      <button 
                        onClick={() => handleEdit(review)} 
                        className="text-xs font-bold text-[#2BBBC5] hover:underline flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Review
                      </button>
                      <button 
                        onClick={() => setDeletingId(review.id)} 
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {reviews.length > 2 && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="rounded-2xl border-gray-200 text-gray-600 font-bold px-8 py-6 h-auto hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp className="w-5 h-5" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5" />
                  View All {reviews.length} Reviews
                </>
              )}
            </Button>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 mt-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageCircle className="w-8 h-8 text-gray-300" />
            </div>
            <h4 className="text-gray-900 font-bold text-lg mb-2">No reviews yet</h4>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Be the first to share your experience with this medication and help others make informed decisions.
            </p>
            <Button
              onClick={() => {
                setEditingReview(null);
                setIsDialogOpen(true);
              }}
              variant="outline"
              className="rounded-xl border-primary text-primary font-bold px-6"
            >
              Write First Review
            </Button>
          </div>
        )}
      </div>

      <MedicineReviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        medicineId={medicineId}
        review={editingReview}
        onSuccess={onRefresh}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        description="Are you sure you want to delete your review? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
