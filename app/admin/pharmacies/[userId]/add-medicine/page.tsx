"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  getPharmacyOfPharmacist, 
  addMedicineToPharmacy, 
  updateMedicineAdmin 
} from "@/Services/admin/pharmacies";
import { medicineService } from "@/Services/medicineServices";
import { toast } from "react-hot-toast";
import { Medicine } from "@/types/medicine";

// Refactored Components
import { AddMedicineHeader } from "@/components/features/pharmacy/inventory/add-medicine/AddMedicineHeader";
import { BasicInfoSection } from "@/components/features/pharmacy/inventory/add-medicine/BasicInfoSection";
import { ImageUploadSection } from "@/components/features/pharmacy/inventory/add-medicine/ImageUploadSection";
import { AdditionalDetailsSection } from "@/components/features/pharmacy/inventory/add-medicine/AdditionalDetailsSection";
import { AddMedicineFooter } from "@/components/features/pharmacy/inventory/add-medicine/AddMedicineFooter";
import { Card } from "@/components/ui/card";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function AdminAddMedicineContent({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { userId } = use(params);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [medicine, setMedicine] = useState<Medicine | undefined>();
  const [pharmacyId, setPharmacyId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true);
        // 1. Get Pharmacy ID
        const pharmacy = await getPharmacyOfPharmacist(userId);
        setPharmacyId(pharmacy.id);

        // 2. If editing, fetch medicine details
        if (editId) {
          const data = await medicineService.getMedicineById(parseInt(editId));
          setMedicine(data);
        }
      } catch (error) {
        console.error("Failed to initialize page:", error);
        toast.error("Failed to load necessary details.");
        router.push(`/admin/pharmacies/${userId}`);
      } finally {
        setIsLoading(false);
      }
    };
    initPage();
  }, [editId, userId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pharmacyId) return;
    
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Ensure all required fields are present according to the user request
      // (BrandName, GenericName, DosageForm, Strength, ATCCode, Price, Quantity, description, warning, suitableFor, notSuitableFor, image, composition, directionsForUse)
      
      let response;
      if (editId) {
        response = await updateMedicineAdmin(parseInt(editId), pharmacyId, formData);
      } else {
        response = await addMedicineToPharmacy(pharmacyId, formData);
      }
      
      toast.success(response.message || (editId ? "Medicine updated successfully!" : "Medicine added successfully!"));
      router.push(`/admin/pharmacies/${userId}`);
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

export default function AdminAddMedicinePage({ params }: { params: Promise<{ userId: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <AdminAddMedicineContent params={params} />
    </Suspense>
  );
}
