"use client";

import { useState, useCallback } from "react";
import { Medicine, MedicineFilterParams } from "@/types";
import { medicineService } from "@/Services/medicineServices";

export interface UseMedicineSearchReturn {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchMedicines: (params: MedicineFilterParams) => Promise<void>;
  fetchAllMedicines: () => Promise<void>;
  clearResults: () => void;
}

export const useMedicineSearch = (): UseMedicineSearchReturn => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchAllMedicines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await medicineService.getAllMedicines();
      setMedicines(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error fetching all medicines:", err);
      setError("Failed to load medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMedicines = useCallback(async (params: MedicineFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const hasFilters = params.name || params.dosageForm || params.strengthUnit || params.category;

      if (!hasFilters) {
        setHasSearched(false);
        const results = await medicineService.getAllMedicines();
        setMedicines(Array.isArray(results) ? results : []);
        setLoading(false);
        return;
      }

      setHasSearched(true);
      let results: Medicine[] = await medicineService.filterMedicines(params);

      // Logic for alternatives if no results found for a specific search
      if (results.length === 0 && params.name) {
        try {
          const alternatives = await medicineService.getAlternativesMedicines(params.name);
          if (alternatives && alternatives.length > 0) {
            results = alternatives;
            setError(`No exact match found for "${params.name}". Showing alternatives.`);
          } else {
            setError("No medicines found.");
          }
        } catch (altErr) {
          console.error("Error fetching alternatives:", altErr);
        }
      }

      setMedicines(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load medicines. Please try again.";
      
      // If it was a search and failed with specific error, try alternatives
      if (params.name && (errorMessage.includes("No medicines found") || errorMessage.includes("404"))) {
          try {
              const alternatives = await medicineService.getAlternativesMedicines(params.name);
              if (alternatives && alternatives.length > 0) {
                  setMedicines(alternatives);
                  setError(`No exact match found for "${params.name}". Showing alternatives.`);
                  return;
              }
          } catch (altErr) {
              console.error("Error fetching alternatives after error:", altErr);
          }
      }

      setError(errorMessage);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    fetchAllMedicines();
    setHasSearched(false);
    setError(null);
  }, [fetchAllMedicines]);

  return {
    medicines,
    loading,
    error,
    hasSearched,
    searchMedicines,
    fetchAllMedicines,
    clearResults,
  };
};
