"use client";

import Image from "next/image";
import { useState } from "react";
import { AddReviewDialog } from "@/Components";
import { doctorService } from "@/Services/doctorService";
import { Review } from "@/types/doctors";
import textImage from "@/assets/user-profile.webp";
import { useUser } from "@/hook/useUser";
import { toast } from "react-hot-toast";
import pen from "@/assets/Pen.svg";
import { Edit2, Trash2 } from "lucide-react";

interface DoctorReviewsProps {
  doctorId: number;
  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
}

export default function DoctorReviews({
  doctorId,
  reviews,
  setReviews,
}: DoctorReviewsProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user } = useUser();
  const currentUserId = user?.id;

  const refreshReviews = async () => {
    const reviewData = await doctorService.GetDoctorReviews(doctorId);
    setReviews(Array.isArray(reviewData) ? reviewData : []);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setEditDialogOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await doctorService.deleteReview(reviewId);
      toast.success("Review deleted successfully.");
      refreshReviews();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete review.";
      toast.error(message);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <div className="mt-auto">
      <div className="flex justify-between">
        <h3 className="text-xl text-primary font-semibold mb-4">
          Reviews and Rating ({reviews.length})
        </h3>
        <div className="flex items-center gap-3">
          <AddReviewDialog
            doctorId={doctorId}
            trigger={
              <div className="flex items-center gap-2 cursor-pointer">
                <Image src={pen} alt="pen" width={20} height={20} />
                <p className="text-primary">Add Review</p>
              </div>
            }
            open={reviewDialogOpen}
            onOpenChange={(value) => {
              setReviewDialogOpen(value);
              if (!value) refreshReviews();
            }}
            onSuccess={refreshReviews}
          />
          <AddReviewDialog
            mode="edit"
            doctorId={doctorId}
            reviewId={selectedReview?.id}
            initialRating={selectedReview?.rating ?? 0}
            initialComment={selectedReview?.comment ?? ""}
            open={editDialogOpen}
            onOpenChange={(value) => {
              setEditDialogOpen(value);
              if (!value) setSelectedReview(null);
              if (!value) refreshReviews();
            }}
            onSuccess={refreshReviews}
          />
        </div>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedReviews.map((review) => {
              const author = review.user;
              const reviewImageUrl = author?.profileImage
                ? `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${author.profileImage}`
                : textImage;

              return (
                <div
                  key={review.id}
                  className="border rounded-2xl p-6 shadow bg-white">
                  <div className="flex items-center gap-4">
                    <Image
                      src={reviewImageUrl}
                      width={50}
                      height={50}
                      alt={author?.userName || "User"}
                      priority
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{author?.userName}</p>
                      <p className="text-gray-500 text-sm">{author?.email}</p>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-2">
                      <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm">
                        {review.rating}
                      </span>
                      {currentUserId && author?.id === currentUserId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-primary hover:text-primary-dark transition"
                            title="Edit review">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete review">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 text-sm">{review.comment}</p>
                </div>
              );
            })}
          </div>
          {reviews.length > 2 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                {showAllReviews ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      )}
    </div>
  );
}
