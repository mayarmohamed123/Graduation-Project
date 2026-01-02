"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pharmacy } from "@/types";
import { Medicine } from "@/types/medicine";
import { pharmacyService } from "@/Services/pharmaciesServices";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import PageHeaderWithBack from "@/Components/common/PageHeaderWithBack";
import PharmacyHero from "@/Components/features/user/pharmacy/PharmacyHero";
import PharmacyMedicineList from "@/Components/features/user/pharmacy/PharmacyMedicineList";

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const pharmacyId = parseInt(id as string, 10);

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pharmacyData, medicinesData] = await Promise.all([
          pharmacyService.getPharmacyById(pharmacyId),
          pharmacyService.getPharmacyMedicinesById(pharmacyId),
        ]);

        setPharmacy(pharmacyData);
        setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
      } catch (err) {
        console.error("Error fetching pharmacy data:", err);
        setError("Failed to load pharmacy details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (pharmacyId) {
      fetchData();
    }
  }, [pharmacyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block max-w-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || "Pharmacy not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-6 mb-2">
          <PageHeaderWithBack title="Pharmacy Details" />
        </div>

        {/* Pharmacy Info Hero */}
        <PharmacyHero pharmacy={pharmacy} />

        {/* Medicine List with Filtering */}
        <PharmacyMedicineList medicines={medicines} />
      </div>
    </div>
  );
}
