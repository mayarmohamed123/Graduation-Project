"use client";

import { Review } from "@/types/doctors";
import DoctorDashboardReviewsList from "@/Components/features/doctor/reviews/DoctorDashboardReviewsList";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { doctorService } from "@/Services/doctorService";
import { appointmentService } from "@/Services/appointmentServices";

export default function DoctorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const fetchDoctorDataAndReviews = async () => {
    try {
      setIsLoading(true);
      
      const appointments = await appointmentService.getDoctorAppointments();
      let doctorId = 0;
      
      if (appointments && appointments.length > 0) {
        doctorId = (appointments[0] as unknown as { doctorId?: number }).doctorId || 0;
      }

      if (!doctorId) doctorId = 10; // Fallback to user's example ID

      const reviewsData = await doctorService.GetDoctorReviews(doctorId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch doctor reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDataAndReviews();
  }, []);

  const handleDeleteClick = (reviewId: number) => {
    setReviewToDelete(reviewId);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      setIsDeleting(reviewToDelete);
      await doctorService.deleteReview(reviewToDelete);
      toast.success("Review deleted successfully");
      setReviews((prev: Review[]) => prev.filter((r: Review) => r.id !== reviewToDelete));
      setReviewToDelete(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-outfit">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Reviews</h1>
          <p className="text-gray-500 mt-1">Manage and monitor feedback from your patients</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-teal-500 rounded-full" />
          <h2 className="text-xl font-bold text-gray-900">Recent Feedback</h2>
        </div>
        
        <DoctorDashboardReviewsList
          reviews={reviews}
          onDelete={handleDeleteClick}
          isDeleting={isDeleting}
        />
      </div>

      <ConfirmDialog
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this patient's review? This action cannot be undone."
        variant="destructive"
        isLoading={isDeleting !== null}
      />
    </div>
  );
}
