"use client";

import { pharmacyService } from "@/Services/pharmaciesServices";
import { AdminMedicine } from "@/types/admin";
import ReviewList from "@/components/features/admin/reviews/ReviewList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Pill } from "lucide-react";
import Image from "next/image";

interface MedicineReviewDialogProps {
  medicine: AdminMedicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineReviewDialog({
  medicine,
  isOpen,
  onClose,
}: MedicineReviewDialogProps) {
  if (!medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-4xl">
        <DialogHeader className="pb-6 border-b border-gray-50 mt-4">
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
              {medicine.imagePath ? (
                <Image
                  src={medicine.imagePath}
                  alt={medicine.brandName}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Pill className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold font-outfit text-gray-900">
                {medicine.brandName}
              </DialogTitle>
              <DialogDescription className="text-teal-600 font-bold uppercase tracking-widest text-xs mt-1">
                {medicine.genericName} - {medicine.dosageFormType}
              </DialogDescription>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  Price: ${medicine.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Stock: {medicine.quantity} Units
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <ReviewList
            type="medicine"
            entityId={medicine.id}
            fetchReviews={pharmacyService.getMedicineReviews}
            deleteReview={pharmacyService.deleteReview}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
