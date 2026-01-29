"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import { Review } from "@/types";
import { userProfileImage } from "@/assets";
import { Button } from "@/components/ui";
import PharmacyReviewDialog from "./PharmacyReviewDialog";
import { useUser } from "@/hooks/useUser";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { toast } from "react-hot-toast";

interface PharmacyReviewsTabProps {
  pharmacyId: number;
  reviews: Review[];
  totalRating: number;
  onRefresh: () => void;
}

export default function PharmacyReviewsTab({
  pharmacyId,
  reviews,
  totalRating,
  onRefresh,
}: PharmacyReviewsTabProps) {
  const { user } = useUser();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await pharmacyService.deleteReview(reviewId);
      toast.success("Review deleted successfully");
      onRefresh();
    } catch (error) {
       console.error("Failed to delete review:", error);
       toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setEditDialogOpen(true);
  };

  const [ratingFilter, setRatingFilter] = useState<number | "All">("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const filteredReviews = reviews.filter((r) => 
    ratingFilter === "All" || r.rating === ratingFilter
  );

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Reviews Summary Header */}
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-1 leading-none">{totalRating.toFixed(1)}</h2>
            <p className="text-sm text-gray-400 font-medium">out of 5</p>
          </div>
          <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                   key={s} 
                   className={`w-5 h-5 ${s <= Math.round(totalRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} 
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-medium">{reviews.length} total ratings</p>
          </div>
        </div>

        <Button 
          onClick={() => setReviewDialogOpen(true)}
          className="bg-primary/10 text-primary hover:bg-primary/20 font-bold px-8 py-6 rounded-2xl border-none shadow-none"
        >
          Write a Review
        </Button>
      </div>

      {/* Filtering Bar for Reviews */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {["All", 5, 4, 3, 2, 1].map((f) => (
          <button
            key={f}
            onClick={() => setRatingFilter(f as number | "All")}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              ratingFilter === f 
                ? "bg-primary text-white border-primary" 
                : "bg-white text-gray-500 border-gray-100 hover:border-primary/30"
            }`}
          >
            {f === "All" ? "All Reviews" : `${f} Stars`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => {
            const author = review.user;
            const reviewImageUrl = author?.profileImage || userProfileImage;
            const isAuthor = user?.id === author?.id;

            return (
              <div key={review.id} className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                      <Image src={reviewImageUrl} fill alt={author?.userName || "User"} className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{author?.userName || "Anonymous"}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified Buyer</span>
                        <span className="text-[10px] text-gray-300">• 2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-100 fill-gray-100"}`} />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {review.comment}
                </p>

                {isAuthor && (
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                    <button onClick={() => handleEdit(review)} className="text-xs font-bold text-primary hover:underline">Edit Review</button>
                    <button onClick={() => handleDelete(review.id)} className="text-xs font-bold text-red-500 hover:underline">Delete</button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-gray-500 font-medium italic">No reviews yet for this pharmacy.</p>
             <button 
                onClick={() => setReviewDialogOpen(true)}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Be the first to share your experience!
              </button>
          </div>
        )}

        {filteredReviews.length > 2 && (
          <div className="pt-4 flex justify-center">
             <Button 
               variant="outline" 
               onClick={() => setShowAllReviews(!showAllReviews)}
               className="px-12 py-6 rounded-2xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
             >
                {showAllReviews ? "Show Less" : "See All Reviews"}
             </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <PharmacyReviewDialog 
        pharmacyId={pharmacyId}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onSuccess={onRefresh}
      />

      <PharmacyReviewDialog 
        mode="edit"
        pharmacyId={pharmacyId}
        reviewId={selectedReview?.id}
        initialRating={selectedReview?.rating}
        initialComment={selectedReview?.comment}
        open={editDialogOpen}
        onOpenChange={(val) => {
           setEditDialogOpen(val);
           if(!val) setSelectedReview(null);
        }}
        onSuccess={onRefresh}
      />
    </div>
  );
}
