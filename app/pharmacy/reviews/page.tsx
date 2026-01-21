"use client";

import { useState, useEffect } from "react";
import { Review, PharmacyProfile } from "@/types";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { pharmacistService } from "@/Services/pharmacistService";
import PharmacyReviewsList from "@/Components/features/pharmacy/reviews/PharmacyReviewsList";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";
import toast from "react-hot-toast";

export default function PharmacyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pharmacy, setPharmacy] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Get pharmacy profile to get the ID
        const profile = await pharmacistService.getPharmacyProfile();
        setPharmacy(profile);

        // 2. Get reviews for this pharmacy
        if (profile?.id) {
          const reviewsData = await pharmacyService.getPharmacyReviews(profile.id);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
        toast.error("Failed to load pharmacy reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setIsDeleting(reviewToDelete);
      await pharmacyService.deleteReview(reviewToDelete);
      
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
      setReviewToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">Reviews & Feedback</h1>
        <p className="text-gray-500 font-medium">
          See what your customers are saying about {pharmacy?.name || "your pharmacy"}.
        </p>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-2">
         <PharmacyReviewsList 
            reviews={reviews} 
            onDelete={handleDeleteClick} 
            isDeleting={isDeleting}
         />
      </div>

      <ConfirmDialog
        isOpen={reviewToDelete !== null}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting !== null}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Keep Review"
      />
    </div>
  );
}
