"use client";

import Image from "next/image";
import { Review } from "@/types";
import { userProfileImage } from "@/assets";
import { Trash2, Star } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface PharmacyReviewsListProps {
  reviews: Review[];
  onDelete: (reviewId: number) => void;
  isDeleting: number | null;
}

export default function PharmacyReviewsList({
  reviews,
  onDelete,
  isDeleting,
}: PharmacyReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">No reviews yet for your pharmacy.</p>
        <p className="text-gray-400 text-sm mt-1">When customers review your pharmacy, they will appear here.</p>
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
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={reviewImageUrl}
                    fill
                    alt={author?.userName || "User"}
                    className="rounded-full object-cover border border-gray-100"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{author?.userName || "Anonymous"}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-600 ml-1">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(review.id)}
                disabled={isDeleting === review.id}
                className="text-red-400 hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2 rounded-full h-9 w-9"
                title="Delete review"
              >
                <Trash2 className={`w-4 h-4 ${isDeleting === review.id ? "animate-pulse" : ""}`} />
              </Button>
            </div>
            
            <div className="flex-1">
              <p className="text-gray-600 text-sm leading-relaxed italic">
                &quot;{review.comment}&quot;
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                Customer Feedback
              </span>
              {author?.address && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
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
