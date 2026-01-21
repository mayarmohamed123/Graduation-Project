"use client";

import { useEffect, useState } from "react";
import { Pharmacy } from "@/types";
import { pharmacyService } from "@/Services/pharmaciesServices";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { PharmacyCard } from "@/Components/common";

export default function TopRatedPharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShowingAll, setIsShowingAll] = useState(false);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const data = await pharmacyService.getTopRatedPharmacies();
        setPharmacies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching top rated pharmacies:", err);
        setError("Failed to load pharmacies");
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  const handleSeeAll = async () => {
    setLoading(true);
    try {
      const data = await pharmacyService.getPharmacies();
      setPharmacies(Array.isArray(data) ? data : []);
      setIsShowingAll(true);
    } catch (err) {
      console.error("Error fetching all pharmacies:", err);
      setError("Failed to load all pharmacies");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 md:mt-20 pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
            {isShowingAll ? "All Pharmacies" : "Top Pharmacies Near You"}
          </h3>
          {!isShowingAll && (
            <button
              onClick={handleSeeAll}
              className="text-sm text-primary hover:underline"
            >
              See All
            </button>
          )}
        </div>
        <p className="text-lg text-gray-600 leading-relaxed ">
          {isShowingAll
            ? "Browse our full list of trusted pharmacies."
            : "Find trusted pharmacies that offer quick delivery and quality service."}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.map((pharmacy) => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>
    </div>
  );
}
