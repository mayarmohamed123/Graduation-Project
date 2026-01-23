"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { medicineService } from "@/Services/medicineServices";
import { toast } from "react-hot-toast";
import { Medicine } from "@/types/medicine";

// Refactored Components
import { AddMedicineHeader } from "@/Components/features/pharmacy/inventory/add-medicine/AddMedicineHeader";
import { BasicInfoSection } from "@/Components/features/pharmacy/inventory/add-medicine/BasicInfoSection";
import { ImageUploadSection } from "@/Components/features/pharmacy/inventory/add-medicine/ImageUploadSection";
import { AdditionalDetailsSection } from "@/Components/features/pharmacy/inventory/add-medicine/AdditionalDetailsSection";
import { AddMedicineFooter } from "@/Components/features/pharmacy/inventory/add-medicine/AddMedicineFooter";
import { Card } from "@/Components/ui/card";
import LoadingSpinner from "@/Components/common/LoadingSpinner";

function AddMedicineContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [medicine, setMedicine] = useState<Medicine | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const fetchMedicine = async () => {
        try {
          const data = await medicineService.getMedicineById(parseInt(editId));
          setMedicine(data);
        } catch (error) {
          console.error("Failed to fetch medicine:", error);
          toast.error("Failed to load medicine details.");
          router.push("/pharmacy/inventory");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMedicine();
    }
  }, [editId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      let response;
      if (editId) {
        response = await pharmacyService.updateMedicine(parseInt(editId), formData);
      } else {
        response = await pharmacyService.addMedicine(formData);
      }
      toast.success(response.message || (editId ? "Medicine updated successfully!" : "Medicine added successfully!"));
      router.push("/pharmacy/inventory");
    } catch (error) {
      console.error("Failed to save medicine:", error);
      toast.error(`Failed to ${editId ? "update" : "add"} medicine. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <AddMedicineHeader isEditing={!!editId} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-none shadow-xl shadow-teal-100/20 rounded-3xl overflow-hidden ring-1 ring-gray-100">
          <BasicInfoSection medicine={medicine} />
          <ImageUploadSection 
            imagePreview={imagePreview} 
            onImageChange={handleImageChange} 
            medicine={medicine}
          />
        </Card>

        <Card className="border-none shadow-xl shadow-teal-100/20 rounded-3xl overflow-hidden ring-1 ring-gray-100">
          <AdditionalDetailsSection medicine={medicine} />
          <AddMedicineFooter isSubmitting={isSubmitting} />
        </Card>
      </form>
    </div>
  );
}

export default function AddMedicinePage() {
  return (
    <Suspense fallback={
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <AddMedicineContent />
    </Suspense>
  );
}
