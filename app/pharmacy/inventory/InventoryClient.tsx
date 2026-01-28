"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Medicine } from "@/types/medicine";
import { InventoryAnalysis, CategoryDashboardResponse } from "@/types/pharmacy";
import { InventoryHeader } from "@/components/features/pharmacy/inventory/InventoryHeader";
import { InventoryStats } from "@/components/features/pharmacy/inventory/InventoryStats";
import { CategoryGrid } from "@/components/features/pharmacy/inventory/CategoryGrid";
import { MedicineTable } from "@/components/features/pharmacy/inventory/MedicineTable";
import { MedicineReviewsDialog } from "@/components/features/pharmacy/inventory/MedicineReviewsDialog";
import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface InventoryClientProps {
  initialData: {
    medicines: Medicine[];
    analysis: InventoryAnalysis | null;
    categoriesData: CategoryDashboardResponse | null;
  };
}

export default function InventoryClient({ initialData }: InventoryClientProps) {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>(initialData.medicines);
  const [analysis] = useState<InventoryAnalysis | null>(initialData.analysis);
  const [categoriesData] = useState<CategoryDashboardResponse | null>(initialData.categoriesData);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reviews State
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [selectedMedicineForReviews, setSelectedMedicineForReviews] = useState<Medicine | null>(null);

  const handleDelete = (medicine: Medicine) => {
    setMedicineToDelete(medicine);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!medicineToDelete) return;

    try {
      setIsDeleting(true);
      const response = await pharmacyService.deleteMedicine(medicineToDelete.id);
      toast.success(response.message || "Medicine deleted successfully.");
      setMedicines(prev => prev.filter(m => m.id !== medicineToDelete.id));
      setDeleteDialogOpen(false);
      setMedicineToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete medicine:", error);
      toast.error("Failed to delete medicine. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMedicines = medicines.filter((m: Medicine) => 
    m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoriesGridData = categoriesData ? categoriesData.thisWeek.map(curr => {
    const prev = categoriesData.lastWeek.find(l => l.categoryName === curr.categoryName);
    const lastCount = prev ? prev.itemsCount : 0;
    
    let trend = "0%";
    if (lastCount === 0) {
      trend = curr.itemsCount > 0 ? "+100%" : "0%";
    } else {
      const diff = ((curr.itemsCount - lastCount) / lastCount) * 100;
      trend = `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`;
    }

    return {
      title: curr.categoryName.charAt(0).toUpperCase() + curr.categoryName.slice(1),
      value: curr.itemsCount,
      trend: trend
    };
  }) : [];

  return (
    <div className="mx-auto space-y-8 p-6 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <InventoryHeader onAddProduct={() => router.push("/pharmacy/inventory/add")} />

      <InventoryStats 
        totalProducts={analysis?.totalProducts ?? 0}
        lowStockCount={analysis?.lowStockCount ?? 0}
        outOfStockCount={analysis?.outOfStockCount ?? 0}
      />

      <CategoryGrid categories={categoriesGridData} />

      <MedicineTable 
        medicines={filteredMedicines}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={(medicine) => router.push(`/pharmacy/inventory/add?id=${medicine.id}`)}
        onDelete={handleDelete}
        onViewReviews={(medicine) => {
          setSelectedMedicineForReviews(medicine);
          setReviewsDialogOpen(true);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Medicine"
        description={`Are you sure you want to delete ${medicineToDelete?.brandName}? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Keep Product"
        isLoading={isDeleting}
        variant="destructive"
      />

      <MedicineReviewsDialog 
        isOpen={reviewsDialogOpen}
        onClose={() => setReviewsDialogOpen(false)}
        medicine={selectedMedicineForReviews}
      />
    </div>
  );
}
