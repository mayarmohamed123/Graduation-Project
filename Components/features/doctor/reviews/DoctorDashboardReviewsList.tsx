"use client";

import Image from "next/image";
import { Review } from "@/types/doctors";
import { userProfileImage } from "@/assets";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface DoctorDashboardReviewsListProps {
  reviews: Review[];
  onDelete: (reviewId: number) => void;
  isDeleting: number | null;
}

export default function DoctorDashboardReviewsList({
  reviews,
  onDelete,
  isDeleting,
}: DoctorDashboardReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 font-outfit">
        <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
          <Star className="w-8 h-8" />
        </div>
        <p className="text-gray-900 font-bold text-lg">No reviews found</p>
        <p className="text-gray-500 text-sm mt-1">When patients review your clinic, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => {
        const author = review.user;
        const reviewImageUrl = author?.profileImage || userProfileImage;

        return (
          <div
            key={review.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <Image
                    src={reviewImageUrl}
                    fill
                    alt={author?.userName || "Patient"}
                    className="rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-lg px-1 py-0.5 flex items-center gap-0.5 text-[10px] font-bold shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {review.rating}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-outfit">{author?.userName || "Anonymous Patient"}</h4>
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
                onClick={() => onDelete(review.id)}
                disabled={isDeleting === review.id}
                className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl h-10 w-10 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete review"
              >
                <Trash2 className={`w-4.5 h-4.5 ${isDeleting === review.id ? "animate-pulse" : ""}`} />
              </Button>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-600 text-sm leading-relaxed italic font-medium">
                &quot;{review.comment}&quot;
              </p>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                Patient Feedback
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
  );
}
