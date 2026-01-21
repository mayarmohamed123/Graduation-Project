"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Medicine } from "@/types/medicine";
import { InventoryAnalysis, CategoryDashboardResponse } from "@/types/pharmacy";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { InventoryHeader } from "@/Components/features/pharmacy/inventory/InventoryHeader";
import { InventoryStats } from "@/Components/features/pharmacy/inventory/InventoryStats";
import { CategoryGrid } from "@/Components/features/pharmacy/inventory/CategoryGrid";
import { MedicineTable } from "@/Components/features/pharmacy/inventory/MedicineTable";
import { MedicineReviewsDialog } from "@/Components/features/pharmacy/inventory/MedicineReviewsDialog";

import { toast } from "react-hot-toast";
import { ConfirmDialog } from "@/Components/common/ConfirmDialog";

export default function InventoryPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [analysis, setAnalysis] = useState<InventoryAnalysis | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reviews State
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [selectedMedicineForReviews, setSelectedMedicineForReviews] = useState<Medicine | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Using hardcoded ID 3 as per user request
        const [medicinesData, analysisData, categDashboard] = await Promise.all([
          pharmacyService.getPharmacyMedicines(),
          pharmacyService.getInventoryAnalysis(),
          pharmacyService.getCategoriesDashboard()
        ]);
        setMedicines(medicinesData);
        setAnalysis(analysisData);
        setCategoriesData(categDashboard);
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
      // Remove from local state
      setMedicines(prev => prev.filter(m => m.id !== medicineToDelete.id));
      setDeleteDialogOpen(false);
      setMedicineToDelete(null);
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

  // Dynamic categories calculation
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

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

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
