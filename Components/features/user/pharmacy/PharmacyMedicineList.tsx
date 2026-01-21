"use client";

import { useState, useMemo } from "react";
import { Search, Package, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { Medicine } from "@/types";
import MedicineCard from "@/Components/common/MedicineCard";
import SearchInput from "@/Components/common/SearchInput";

interface PharmacyMedicineListProps {
  medicines: Medicine[];
}

export default function PharmacyMedicineList({ medicines }: PharmacyMedicineListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedForm, setSelectedForm] = useState<string>("All");
  const [selectedUnit, setSelectedUnit] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(medicines.map((m) => m.medicationCategory)))].filter(Boolean), [medicines]);
  const dosageForms = useMemo(() => ["All", ...Array.from(new Set(medicines.map((m) => m.dosageFormType)))].filter(Boolean), [medicines]);
  const strengthUnits = useMemo(() => ["All", ...Array.from(new Set(medicines.map((m) => m.strengthUnit)))].filter(Boolean), [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch = medicine.brandName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || medicine.medicationCategory === selectedCategory;
      const matchesForm = selectedForm === "All" || medicine.dosageFormType === selectedForm;
      const matchesUnit = selectedUnit === "All" || medicine.strengthUnit === selectedUnit;

      return matchesSearch && matchesCategory && matchesForm && matchesUnit;
    });
  }, [medicines, searchQuery, selectedCategory, selectedForm, selectedUnit]);

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedForm !== "All",
    selectedUnit !== "All"
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedForm("All");
    setSelectedUnit("All");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline font-bold"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-10">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Category</label>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left flex items-center justify-between group ${selectedCategory === cat
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Dosage Form Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Dosage Form</label>
              <div className="flex flex-col gap-2">
                {dosageForms.map((form) => (
                  <button
                    key={form}
                    onClick={() => setSelectedForm(form)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left flex items-center justify-between group ${selectedForm === form
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span>{form}</span>
                    {selectedForm === form && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Strength Unit Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-[0.1em]">Strength Unit</label>
              <div className="flex flex-col gap-2">
                {strengthUnits.map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setSelectedUnit(unit)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left flex items-center justify-between group ${selectedUnit === unit
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span>{unit}</span>
                    {selectedUnit === unit && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Search Header - Centered In Content Area */}
        <div className="mb-10">
          <div className="max-w-full ">
            <SearchInput
              onSearch={setSearchQuery}
              placeholder="Search specifically in this pharmacy..."
              className="!mb-0"
            />
          </div>

          <div className="flex items-center justify-between mt-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Medicines</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{filteredMedicines.length} Available Items</p>
              </div>
            </div>

            {/* Display active filters summary on mobile if any */}
            <div className="lg:hidden">
              {activeFiltersCount > 0 && (
                <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-bold">
                  {activeFiltersCount} Filters Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Grid */}
        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-gray-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              We couldn&apos;t find any medicine matching your search or selected filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

