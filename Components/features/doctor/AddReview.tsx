"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { filledStarIcon, emptyStarIcon } from "@/assets";
import { doctorService } from "@/Services/doctorService";
import { toast } from "react-hot-toast";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui";

export default function AddReviewDialog({
  trigger,
  doctorId,
  open,
  onOpenChange,
  mode = "create",
  reviewId,
  initialRating = 0,
  initialComment = "",
  onSuccess,
}: {
  trigger?: React.ReactNode;
  doctorId: number;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  mode?: "create" | "edit";
  reviewId?: number;
  initialRating?: number;
  initialComment?: string;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(initialRating);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [review, setReview] = useState(initialComment);

  useEffect(() => {
    if (open) {
      setRating(initialRating);
      setReview(initialComment);
    }
  }, [open, initialRating, initialComment]);

  const handleSubmit = async () => {
    if (rating === 0 || !review.trim()) {
      toast.error("Please provide a rating and comment.");
      return;
    }

    try {
      setSubmitLoading(true);

      if (mode === "edit" && reviewId) {
        const res = await doctorService.updateReview(reviewId, {
          Rating: rating,
          Comment: review,
        });
        toast.success(res.message || "Review updated successfully.");
      } else {
        const payload = {
          DoctorId: doctorId,
          Rating: rating,
          Comment: review,
        };

        const res = await doctorService.addReview(payload);
        toast.success(res.message || "Review added successfully.");
      }

      // RESET FORM
      setRating(0);
      setReview("");
      onSuccess?.();

      // CLOSE THE DIALOG
      onOpenChange(false);
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
            Share your feedback about this doctor to help others.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm mt-4 mb-2">Add Your Rating</p>
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              src={i <= rating ? filledStarIcon : emptyStarIcon}
              alt="star"
              width={30}
              height={30}
              onClick={() => setRating(i)}
              className="cursor-pointer"
            />
          ))}
          <span className="text-primary font-medium">{rating}</span>
        </div>

        <label className="text-sm">Write your review</label>
        <textarea
          placeholder="Write here ..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full mt-1 px-4 py-3 h-32 border rounded-xl text-sm"
        />

        <Button
          onClick={handleSubmit}
          disabled={submitLoading}
          className="
            w-full mt-6 py-3 rounded-full 
            bg-[#2BBBC5] text-white text-sm 
            hover:opacity-90 transition
          ">
          {cta}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
