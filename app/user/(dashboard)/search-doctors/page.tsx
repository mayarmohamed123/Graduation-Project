"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDoctors } from "@/hooks/useDoctors";
import { FilterState, Doctor } from "@/types/doctors";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SearchInput from "@/components/common/SearchInput";
import DoctorCard from "@/components/features/doctor/DoctorCard";
import { Button } from "@/components/ui/button";
import SpecialtyIcon from "@/components/common/SpecialtyIcon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import { Filter } from "lucide-react";

// Medical specialties list will be defined inside the component

export default function SearchDoctorsPage() {
  const specialties = [
    "Pediatrics",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Ophthalmology",
    "ENT",
    "Psychiatry",
    "Gynecology",
    "Urology",
    "Gastroenterology",
    "Endocrinology",
    "Nephrology",
    "Rheumatology",
    "Oncology",
    "GeneralSurgery",
    "Dentistry",
  ];

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { doctors, loading, error, refetch } = useDoctors();

  const [filters, setFilters] = useState<FilterState>({
    specialty: null,
    name: "",
    gender: null,
    consultationType: null,
    sort: "all",
  });

  const [searchInput, setSearchInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = async (query: string) => {
    setSearchInput(query);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev: FilterState) => {
      // Handle sort field which is always a string
      if (key === "sort") {
        return {
          ...prev,
          sort: value as FilterState["sort"],
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      specialty: null,
      name: "",
      gender: null,
      consultationType: null,
      sort: "all",
    });
    setSearchInput("");
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev: FilterState) => ({
        ...prev,
        name: searchInput,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Refetch when filters change
  useEffect(() => {
    if (isAuthenticated) {
      refetch(filters);
    }
  }, [filters, refetch, isAuthenticated]);

  // Show loading while checking authentication
  if (authLoading) {
    return <LoadingSpinner />;
  }

 

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
          <PageHeaderWithBack title="Doctors" />
          {/* Search Input */}
          <SearchInput onSearch={handleSearchChange} />

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden mt-4 w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition">
            <Filter size={20} />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Collapsible on mobile */}
          <div className={`
            lg:block lg:w-1/4
            ${isFilterOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm hover:text-primary">
                  Clear All
                </button>
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Specialty
                </h3>
                <select
                  value={filters.specialty || ""}
                  onChange={(e) => handleFilterChange("specialty", e.target.value || null)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Gender
                </h3>
                <div className="flex gap-2">
                  {["male", "female"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() =>
                        handleFilterChange(
                          "gender",
                          gender as "male" | "female"
                        )
                      }
                      className={`flex-1 py-2 px-3 text-sm rounded-3xl border ${filters.gender === gender
                        ? "bg-primary text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Consultation Type
                </h3>
                <div className="space-y-3">
                  {[
                    { value: "inClinic", label: "In-clinic" },
                    { value: "homeVisit", label: "Home Visit" },
                  ].map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center space-x-2">
                      <Checkbox
                        id={`consultation-${type.value}`}
                        checked={filters.consultationType === type.value}
                        onCheckedChange={(checked) =>
                          handleFilterChange(
                            "consultationType",
                            checked ? type.value : null
                          )
                        }
                      />
                      <Label
                        htmlFor={`consultation-${type.value}`}
                        className="text-sm font-normal cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Sort By
                </h3>
                <RadioGroup
                  value={filters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                  className="space-y-3">
                  {[
                    { value: "all", label: "All" },
                    { value: "mostRecommended", label: "Most recommended" },
                    { value: "priceLowToHigh", label: "Price: Low to high" },
                    { value: "priceHighToLow", label: "Price: High to low" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.value}
                        id={`sort-${option.value}`}
                      />
                      <Label
                        htmlFor={`sort-${option.value}`}
                        className="text-sm font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => refetch(filters)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found {doctors.length} doctor
                    {doctors.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {doctors.map((doctor: Doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                    />
                  ))}
                </div>

                {/* Show message if no doctors found */}
                {doctors.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      No doctors found matching your filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-blue-600 hover:text-blue-700">
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
