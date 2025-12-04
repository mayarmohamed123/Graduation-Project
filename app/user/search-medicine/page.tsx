"use client";


import { TopRatedPharmacies } from "@/Components/sections";
import React, { useState } from "react";
import { Medicine } from "@/types";
import { pharmacyService } from "@/Services/pharmacies";
import { LoadingSpinner, MedicineCard, SearchInput } from "@/Components/shared";
import { SlidersHorizontal } from "lucide-react";
import PrvButton from "@/Components/shared/prvButton";

export default function SearchMedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const dosageForms = ["Tablet", "Syrup", "Capsule", "Injection", "Cream"];
  const strengthUnits = ["mg", "g", "ml", "μg"];

  const handleFormChange = (form: string) => {
    // Toggle selection: if same form is clicked, deselect it
    setSelectedForm((prev) => (prev === form ? "" : form));
  };

  const handleUnitChange = (unit: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await fetchMedicines(query, selectedForm, selectedUnits);
  };

  const fetchMedicines = async (
    query: string,
    form: string,
    units: string[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      let results: Medicine[] = [];

      // If filters are applied, use filter API
      if (form || units.length > 0) {
        const filters: any = {};
        if (form) {
          filters.dosageForm = form;
        }
        if (units.length > 0) {
          filters.strengthUnit = units[0]; // API typically accepts one value
        }
        results = await pharmacyService.filterMedicines(filters);
      } else if (query.trim()) {
        // If only search query, use search API
        results = await pharmacyService.searchMedicineByName(query);
      }

      setMedicines(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setError("Failed to load medicines. Please try again.");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchMedicines(searchQuery, selectedForm, selectedUnits);
  };

  // Auto-apply filters when changed
  React.useEffect(() => {
    if (hasSearched) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedForm, selectedUnits]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <PrvButton/>
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Medicine
            </h3>
          </div>
          {/* Search Input */}
          <SearchInput onSearch={handleSearch} />
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside className="w-64 bg-white rounded-2xl p-6 border border-gray-200 h-fit sticky top-4 hidden lg:block">
            {/* Filter Header */}
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
            </div>

            {/* Form Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Form
              </h4>
              <div className="space-y-2">
                {dosageForms.map((form) => (
                  <label
                    key={form}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="dosageForm"
                      checked={selectedForm === form}
                      onChange={() => handleFormChange(form)}
                      className="w-4 h-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {form}s
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Strength Unit Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Strength Unit
              </h4>
              <div className="space-y-2">
                {strengthUnits.map((unit) => (
                  <label
                    key={unit}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUnits.includes(unit)}
                      onChange={() => handleUnitChange(unit)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {unit}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            {/* Search Results */}
            {!loading && hasSearched && (
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Search Results
                </h3>
                <p className="text-gray-600 mb-6">
                  {medicines.length > 0
                    ? `Found ${medicines.length} medicine${
                        medicines.length > 1 ? "s" : ""
                      }`
                    : "No medicines found. Try a different search term or adjust filters."}
                </p>

                {medicines.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {medicines.map((medicine) => (
                      <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Top Rated Pharmacies Section */}
            {/* {!hasSearched && <TopRatedPharmacies />} */}
          </div>
        </div>
      </div>
    </div>
  );
}

