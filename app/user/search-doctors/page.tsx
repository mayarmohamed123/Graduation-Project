"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useDoctors } from "@/hooks/useDoctors";
import { FilterState } from "@/types/doctors";
import { useAuthToken } from "@/hooks/useAuthToken";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import SearchInput from "@/components/common/SearchInput";
import DoctorCard from "@/components/features/doctor/DoctorCard";
import PrvButton from "@/components/common/prvButton";
import { Button } from "@/components/ui/button";
import SpecialtyIcon from "@/components/common/SpecialtyIcon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";
import { Filter, X } from "lucide-react";

// Medical specialties list
const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
];

export default function SearchDoctorsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { token } = useAuthToken();
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
    setFilters((prev) => {
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
      setFilters((prev) => ({
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

  // Show login prompt if not authenticated
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //           Authentication Required
  //         </h2>
  //         <p className="text-gray-600 mb-6">
  //           Please log in to search for doctors.
  //         </p>
  //         <a
  //           href="/login"
  //           className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
  //           Go to Login
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex">
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
            {/* Specialty Filter */}
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-medium text-black mb-3">
                Choose Specialties
              </h3>

              <div className="flex flex-wrap gap-2">
                {/* All Specialties Button */}
                <Button
                  variant={!filters.specialty === null ? "outline" : "default"}
                  size="lg"
                  onClick={() => handleFilterChange("specialty", null)}
                  className={`
                             flex items-center gap-2 border border-[#B2B2B2]
                            ${!filters.specialty === null
                      ? "text-[#4D4D4D]"
                      : "text-white"
                    }
                            `}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  All Specialties
                </Button>

                {/* Other Specialties */}
                {specialties.map((specialty) => {
                  const isActive = filters.specialty !== specialty;

                  return (
                    <Button
                      key={specialty}
                      variant={isActive ? "outline" : "default"}
                      size="lg"
                      onClick={() => handleFilterChange("specialty", specialty)}
                      className={`
                                flex items-center gap-2 border border-[#B2B2B2]
                                ${isActive ? "text-[#4D4D4D]" : "text-white"}
                                `}>
                      <SpecialtyIcon specialty={specialty} />
                      {specialty}
                    </Button>
                  );
                })}
              </div>
            </div>

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
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      showExtraInfo={true}
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
