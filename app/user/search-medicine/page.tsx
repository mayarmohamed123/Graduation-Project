"use client";


import TopRatedPharmacies from "@/Components/features/sections/TopRatedPharmacies";
import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import MedicineCard from "@/Components/common/MedicineCard";
import SearchInput from "@/Components/common/SearchInput";
import PageHeaderWithBack from "@/Components/common/PageHeaderWithBack";

import { useMedicineSearch } from "@/hooks/useMedicineSearch";

export default function SearchMedicinePage() {
  const {
    medicines,
    loading,
    error,
    hasSearched,
    searchMedicines,
    clearResults,
  } = useMedicineSearch();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const dosageForms = ["Tablet", "Syrup", "Capsule", "Injection", "Cream"];
  const strengthUnits = ["mg", "g", "ml", "μg"];
  const categories = [
    "Antibiotic",
    "Antihistamine",
    "Antipyretic",
    "Cardiovascular",
    "Dermatology",
    "Skincare",
    "Supplement",
    "Respiratory",
    "Vitamin",
    "Antidiabetic"
  ];

  const handleFormChange = (form: string) => {
    setSelectedForm((prev) => (prev === form ? "" : form));
  };

  const handleUnitChange = (unit: string) => {
    setSelectedUnit((prev) => (prev === unit ? "" : unit));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  const clearFilters = () => {
    setSelectedForm("");
    setSelectedUnit("");
    setSelectedCategory("");
    if (!searchQuery) {
        clearResults();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Trigger search when query or filters change
  React.useEffect(() => {
    if (searchQuery || selectedForm || selectedUnit || selectedCategory) {
      searchMedicines({
        name: searchQuery,
        dosageForm: selectedForm,
        strengthUnit: selectedUnit,
        category: selectedCategory,
      });
    } else if (hasSearched) {
        clearResults();
    }
  }, [searchQuery, selectedForm, selectedUnit, selectedCategory, searchMedicines, clearResults, hasSearched]);


  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex">
          <PageHeaderWithBack title="Medicine" />
          {/* Search Input */}
          <SearchInput onSearch={handleSearch} />
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {hasSearched && (
            <aside className="w-64 bg-white rounded-2xl p-6 border border-gray-200 h-fit sticky top-4 hidden lg:block">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filter
                  </h3>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Section */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
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
                        checked={selectedUnit === unit}
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
          )}

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
                    ? `Found ${medicines.length} medicine${medicines.length > 1 ? "s" : ""
                    }`
                    : "No medicines found. Try a different search term or adjust filters."}
                </p>

                {medicines.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicines.map((medicine) => (
                      <MedicineCard key={medicine.id} medicine={medicine} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Top Rated Pharmacies Section */}
            {!hasSearched && <TopRatedPharmacies />}
          </div>
        </div>
      </div>
    </div>
  );
}

