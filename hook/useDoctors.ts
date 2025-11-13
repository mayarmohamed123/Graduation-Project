"use client";

import { useState, useEffect, useCallback } from "react";
import { Doctor } from "@/types/doctors";
import { doctorService } from "@/Services/doctorService";
import { useAuthToken } from "./useAuthToken";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthToken();

  const fetchDoctors = useCallback(
    async (filters?: {
      specialty?: string | null;
      name?: string;
      gender?: "male" | "female" | null;
      consultationType?: "inClinic" | "homeVisit" | null;
      sort?: string;
    }) => {
      if (!isAuthenticated) {
        setError("Please log in to view doctors");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiFilters: {
          specialty?: string;
          name?: string;
          gender?: string;
          consultationType?: string;
          sort?: string;
        } = {};

        // Map UI filters to API filters
        if (filters?.specialty) apiFilters.specialty = filters.specialty;
        if (filters?.name) apiFilters.name = filters.name;
        if (filters?.gender) apiFilters.gender = filters.gender;
        if (filters?.consultationType)
          apiFilters.consultationType = filters.consultationType;

        // Map sort options
        if (filters?.sort === "priceLowToHigh") {
          apiFilters.sort = "PriceLowToHigh";
        } else if (filters?.sort === "priceHighToLow") {
          apiFilters.sort = "PriceHighToLow";
        }

        let data: Doctor[];

        if (Object.keys(apiFilters).length === 0) {
          // No filters, get all doctors
          data = await doctorService.getAllDoctors();
        } else {
          // Apply filters
          data = await doctorService.getFilteredDoctors(apiFilters);
        }

        setDoctors(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch doctors";
        setError(errorMessage);
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchDoctors();
    }
  }, [fetchDoctors, isAuthenticated, authLoading]);

  return {
    doctors,
    loading: loading || authLoading,
    error,
    refetch: fetchDoctors,
    isAuthenticated,
  };
};
