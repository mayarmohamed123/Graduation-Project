"use client";


import { TopRatedPharmacies } from "@/Components/sections";
import React, { useState } from "react";
import { Medicine } from "@/types";
import { medicineService } from "@/Services/medicine";
import { LoadingSpinner, MedicineCard, SearchInput } from "@/Components/shared";
import { SlidersHorizontal } from "lucide-react";
import PrvButton from "@/Components/shared/prvButton";
import PageHeaderWithBack from "@/Components/shared/PageHeaderWithBack";

export default function SearchMedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const dosageForms = ["Tablet", "Syrup", "Capsule", "Injection", "Cream"];
  const strengthUnits = ["mg", "g", "ml", "μg"];
  const categories = [
    "Antibiotic",
    "Pain Relief",
    "Vitamins & Supplements",
    "Cold & Flu",
    "First Aid",
    "Skincare",
    "Digestive Health",
    "Allergy",
  ];

  const handleFormChange = (form: string) => {
    // Toggle selection: if same form is clicked, deselect it
    setSelectedForm((prev) => (prev === form ? "" : form));
  };

  const handleUnitChange = (unit: string) => {
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit]
    );
  };

  const handleCategoryChange = (category: string) => {
    // Toggle selection
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  const clearFilters = () => {
    setSelectedForm("");
    setSelectedUnits([]);
    setSelectedCategory("");
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await fetchMedicines(query, selectedForm, selectedUnits, selectedCategory);
  };

  const fetchMedicines = async (
    query: string,
    form: string,
    units: string[],
    category: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      let results: Medicine[] = [];

      // If filters are applied, use filter API
      if (form || units.length > 0 || category) {
        const filters: any = {};
        if (form) {
          filters.dosageForm = form;
        }
        if (units.length > 0) {
          filters.strengthUnit = units[0]; // API typically accepts one value
        }
        if (category) {
          filters.category = category;
        }
        results = await medicineService.filterMedicines(filters);
      } else if (query.trim()) {
        // If only search query, use search API
        const response: any = await medicineService.searchMedicineByName(query);

        // Check if response is the specific "No alternative medicines found" message (as requested)
        // or if it's not an array (implying some other message object)
        if (
          response?.message === "No alternative medicines found." ||
          !Array.isArray(response)
        ) {
          // Fallback to alternatives
          try {
            const alternatives = await medicineService.getAlternativesMedicines(
              query
            );
            results = alternatives;
            if (Array.isArray(alternatives) && alternatives.length > 0) {
              setError(
                `No exact match found for "${query}". Showing alternatives.`
              );
            }
          } catch (altErr) {
            console.error("Error fetching alternatives:", altErr);
            results = [];
          }
        } else {
          results = response;
        }
      }

      setMedicines(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error("Error fetching medicines:", err);

      // Handle error case (e.g. 404 with message)
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (
        query.trim() &&
        !form &&
        units.length === 0 &&
        !category &&
        (errorMessage === "No alternative medicines found." ||
          errorMessage.includes("No medicines found"))
      ) {
        try {
          const alternatives = await medicineService.getAlternativesMedicines(
            query
          );
          setMedicines(Array.isArray(alternatives) ? alternatives : []);
          if (Array.isArray(alternatives) && alternatives.length > 0) {
            setError(
              `No exact match found for "${query}". Showing alternatives.`
            );
          } else {
            setError("No medicines found.");
          }
          return;
        } catch (altErr) {
          console.error("Error fetching alternatives:", altErr);
        }
      }

      setError("Failed to load medicines. Please try again.");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchMedicines(searchQuery, selectedForm, selectedUnits, selectedCategory);
  };

  // Auto-apply filters when changed
  React.useEffect(() => {
    if (hasSearched) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedForm, selectedUnits, selectedCategory]);

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

