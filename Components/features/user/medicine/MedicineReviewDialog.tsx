"use client";
// Touched to refresh IDE state

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Review } from "@/types";
import { toast } from "react-hot-toast";

interface MedicineReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicineId: number;
  review?: Review | null;
  onSuccess: () => void;
}

export default function MedicineReviewDialog({
  isOpen,
  onClose,
  medicineId,
  review,
  onSuccess,
}: MedicineReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [review, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      if (review) {
        await pharmacyService.updateReview(review.id, {
          Rating: rating,
          Comment: comment,
        });
        toast.success("Review updated successfully");
      } else {
        await pharmacyService.addReview({
          MedicationId: medicineId,
          Rating: rating,
          Comment: comment,
        });
        toast.success("Review added successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(review ? "Failed to update review" : "Failed to add review");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none rounded-[32px] overflow-hidden p-0 shadow-2xl">
        <div className="bg-[#f8fdfe] px-8 py-6 border-b border-teal-50">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-teal-600" />
              </div>
              <DialogTitle className="text-2xl font-bold font-outfit text-gray-900">
                {review ? "Edit Review" : "Write a Review"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-500 font-medium ml-13">
                Share your experience with this medication to help others.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Rating Selection */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block text-center">
              Your overall rating
            </label>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    } transition-colors duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block">
              Share more details
            </label>
            <Textarea
              placeholder="How was the medication? Did you notice any side effects? (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[150px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all text-gray-700 font-medium placeholder:text-gray-300"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-2 h-14 rounded-2xl bg-[#2BBBC5] hover:bg-[#25a0a9] text-white font-bold transition-all shadow-lg shadow-teal-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                review ? "Update Review" : "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
