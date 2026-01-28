"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { filledStarIcon, emptyStarIcon } from "@/assets";
import { pharmacyService, CreateReviewInput, UpdateReviewInput } from "@/Services/pharmaciesServices";
import { toast } from "react-hot-toast";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";

interface PharmacyReviewDialogProps {
  trigger?: React.ReactNode;
  pharmacyId: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode?: "create" | "edit";
  reviewId?: number;
  initialRating?: number;
  initialComment?: string;
  onSuccess?: () => void;
}

export default function PharmacyReviewDialog({
  trigger,
  pharmacyId,
  open,
  onOpenChange,
  mode = "create",
  reviewId,
  initialRating = 0,
  initialComment = "",
  onSuccess,
}: PharmacyReviewDialogProps) {
  const [rating, setRating] = useState(initialRating);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (open) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [open, initialRating, initialComment]);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    try {
      setSubmitLoading(true);

      if (mode === "edit" && reviewId) {
        const payload: UpdateReviewInput = {
          Rating: rating,
          Comment: comment,
        };
        const res = await pharmacyService.updateReview(reviewId, payload);
        toast.success(res.message || "Review updated successfully.");
      } else {
        const payload: CreateReviewInput = {
          PharmacyId: pharmacyId,
          Rating: rating,
          Comment: comment,
        };

        const res = await pharmacyService.addReview(payload);
        toast.success(res.message || "Review added successfully.");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const title = mode === "edit" ? "Edit Review" : "Add a Review";
  const cta = submitLoading
    ? mode === "edit"
      ? "Updating..."
      : "Submitting..."
    : mode === "edit"
      ? "Update Review"
      : "Submit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="p-8 max-w-lg rounded-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">{title}</DialogTitle>
          <DialogDescription className="text-sm font-medium text-gray-700">
            Tell others about your experience with this pharmacy.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm mt-4 mb-2 font-medium text-gray-700">Add Your Rating</p>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src={i <= rating ? filledStarIcon : emptyStarIcon}
              alt="star"
              width={30}
              height={30}
              onClick={() => setRating(i)}
              className="cursor-pointer hover:scale-110 transition-transform"
            />
          ))}
          <span className="text-primary font-bold ml-2 text-lg">{rating > 0 ? rating : ""}</span>
        </div>

        <label className="text-sm font-medium text-gray-700">Write your review</label>
        <textarea
          placeholder="Share your experience with this pharmacy..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-2 px-4 py-3 h-32 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />

        <Button
          onClick={handleSubmit}
          disabled={submitLoading}
          className="
            w-full mt-6 py-6 rounded-2xl 
            bg-primary text-white text-base font-bold
            hover:opacity-90 transition shadow-lg shadow-primary/20
          ">
          {cta}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
