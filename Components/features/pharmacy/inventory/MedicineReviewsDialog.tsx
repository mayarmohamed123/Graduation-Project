"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Review, Medicine } from "@/types";
import { pharmacyService } from "@/Services/pharmaciesServices";
import PharmacyReviewsList from "@/Components/features/pharmacy/reviews/PharmacyReviewsList";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";

interface MedicineReviewsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

export const MedicineReviewsDialog = ({
  isOpen,
  onClose,
  medicine,
}: MedicineReviewsDialogProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && medicine) {
      const fetchReviews = async () => {
        try {
          setIsLoading(true);
          const data = await pharmacyService.getMedicineReviews(medicine.id);
          setReviews(data);
        } catch (error) {
          console.error("Failed to fetch medicine reviews:", error);
          toast.error("Failed to load reviews for this medicine");
        } finally {
          setIsLoading(false);
        }
      };
      fetchReviews();
    } else if (!isOpen) {
      setReviews([]);
    }
  }, [isOpen, medicine]);

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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-8 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold font-outfit text-gray-900">
                  Medicine Reviews
                </DialogTitle>
                {medicine && (
                  <DialogDescription className="text-gray-500 font-medium">
                    Feedback for <span className="text-teal-600 font-bold">{medicine.brandName}</span>
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              <PharmacyReviewsList
                reviews={reviews}
                onDelete={handleDeleteClick}
                isDeleting={isDeleting}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={reviewToDelete !== null}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting !== null}
        title="Delete Review"
        description="Are you sure you want to delete this customer feedback? This action cannot be undone."
        confirmText="Delete Review"
        cancelText="Keep Review"
      />
    </>
  );
};
