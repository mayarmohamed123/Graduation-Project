"use client";

import { useState, useEffect } from "react";
import { Star, Search, Trash2, User, Building2, Pill, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Review } from "@/types";
import { userProfileImage } from "@/assets";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface Entity {
  id: number;
  name: string;
  image?: string | null;
  subtext?: string;
}

interface EntityReviewManagerProps {
  type: "doctor" | "pharmacy" | "medicine";
  fetchEntities: () => Promise<Entity[]>;
  fetchReviews: (id: number) => Promise<Review[]>;
  deleteReview: (id: number) => Promise<{ message: string }>;
}

export default function EntityReviewManager({
  type,
  fetchEntities,
  fetchReviews,
  deleteReview,
}: EntityReviewManagerProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setLoadingEntities(true);
        const data = await fetchEntities();
        setEntities(data);
        setFilteredEntities(data);
      } catch (error) {
        console.error(`Failed to fetch ${type}s:`, error);
        toast.error(`Failed to load ${type}s`);
      } finally {
        setLoadingEntities(false);
      }
    };
    loadEntities();
  }, [type, fetchEntities]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntities(entities);
    } else {
      setFilteredEntities(
        entities.filter((e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, entities]);

  const handleEntitySelect = async (id: number) => {
    setSelectedEntityId(id);
    try {
      setLoadingReviews(true);
      const data = await fetchReviews(id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Failed to fetch reviews for ${type}:`, error);
      toast.error("Failed to load reviews");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(reviewToDelete);
      await deleteReview(reviewToDelete);
      toast.success("Review deleted successfully");
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      setReviewToDelete(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  const getEntityIcon = () => {
    switch (type) {
      case "doctor": return <User className="w-5 h-5" />;
      case "pharmacy": return <Building2 className="w-5 h-5" />;
      case "medicine": return <Pill className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)]">
      {/* Entity Selection Sidebar */}
      <div className="w-full lg:w-80 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={`Search ${type}...`}
              className="pl-9 rounded-2xl bg-gray-50 border-none focus-visible:ring-teal-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
          {loadingEntities ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-gray-400">No {type}s found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredEntities.map((entity) => (
                <button
                  key={entity.id}
                  onClick={() => handleEntitySelect(entity.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group ${
                    selectedEntityId === entity.id
                      ? "bg-teal-50 text-teal-700"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedEntityId === entity.id ? "bg-white shadow-sm" : "bg-gray-50 group-hover:bg-white"
                  }`}>
                    {entity.image ? (
                      <Image src={entity.image} width={40} height={40} alt={entity.name} className="rounded-xl object-cover" />
                    ) : (
                      getEntityIcon()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{entity.name}</p>
                    {entity.subtext && <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">{entity.subtext}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedEntityId ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center text-teal-500 mb-6">
              <Star className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Select a {type}</h3>
            <p className="text-gray-500 max-w-xs">Select {type === 'doctor' ? 'a doctor' : type === 'pharmacy' ? 'a pharmacy' : 'a medicine'} from the list to view and manage its reviews.</p>
          </div>
        ) : loadingReviews ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-3xl border border-gray-100">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
          </div>
        ) : !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
              <Star className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">There are no patient reviews for this {type} yet.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              {reviews.map((review) => {
                const author = review.user;
                const reviewImageUrl = author?.profileImage || userProfileImage;

                return (
                  <div
                    key={review.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14">
                          <Image
                            src={reviewImageUrl}
                            fill
                            alt={author?.userName || "User"}
                            className="rounded-2xl object-cover border-2 border-white shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-lg px-1 py-0.5 flex items-center gap-0.5 text-[10px] font-bold shadow-sm">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {review.rating}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{author?.userName || "Anonymous"}</h4>
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
                        onClick={() => handleDeleteClick(review.id)}
                        disabled={isDeleting === review.id}
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl h-10 w-10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete review"
                      >
                        <Trash2 className={`w-4.5 h-4.5 ${isDeleting === review.id ? "animate-pulse" : ""}`} />
                      </Button>
                    </div>
                    
                    <div className="flex-1 text-gray-600 text-sm leading-relaxed italic font-medium">
                        &quot;{review.comment}&quot;
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md">
                        {type === 'medicine' ? 'Medication Feedback' : 'Patient Feedback'}
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
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        variant="destructive"
        isLoading={isDeleting !== null}
      />
    </div>
  );
}
