"use client";

import React, { useState, useEffect } from "react";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Medicine } from "@/types/medicine";
import { InventoryAnalysis, CategoryDashboardResponse } from "@/types/pharmacy";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { InventoryHeader } from "@/Components/features/pharmacy/inventory/InventoryHeader";
import { InventoryStats } from "@/Components/features/pharmacy/inventory/InventoryStats";
import { CategoryGrid } from "@/Components/features/pharmacy/inventory/CategoryGrid";
import { MedicineTable } from "@/Components/features/pharmacy/inventory/MedicineTable";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [analysis, setAnalysis] = useState<InventoryAnalysis | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Using hardcoded ID 3 as per user request
        const [medicinesData, analysisData, categDashboard] = await Promise.all([
          pharmacyService.getPharmacyMedicines(3),
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
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <InventoryHeader />

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
      />
    </div>
  );
}
