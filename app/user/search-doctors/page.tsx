// app/search-doctors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDoctors } from "@/hook/useDoctors";
import { FilterState } from "@/types/doctors";
import { useAuthToken } from "@/hook/useAuthToken";
import { SearchInput } from "@/Components";
import PrvButton from "@/Components/shared/prvButton";
import { Button } from "@/Components/ui/button";
import SpecialtyIcon from "@/Components/shared/SpecialtyIcon";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";

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
  const { status: sessionStatus } = useSession();
  const { isAuthenticated, isLoading: authLoading } = useAuthToken();
  const { doctors, loading, error, refetch } = useDoctors();

  const [filters, setFilters] = useState<FilterState>({
    specialty: null,
    name: "",
    gender: null,
    consultationType: null,
    sort: "all",
  });

  const [searchInput, setSearchInput] = useState("");

  // Helper function to extract name from email
  const getDoctorName = (email: string): string => {
    const namePart = email.split("@")[0];
    return namePart
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
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
  if (sessionStatus === "loading" || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex">
          <div className="flex justify-between">
            <PrvButton />
            <h3 className="text-4xl font-semibold text-gray-900">Doctor</h3>
          </div>
          {/* Search Input */}
          <SearchInput />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
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
                      className={`flex-1 py-2 px-3 text-sm rounded-3xl border ${
                        filters.gender === gender
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
              <h3 className="text-2xl font-medium text-black mb-3">
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
                            ${
                              !filters.specialty === null
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
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => {
                    const image = `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${doctor.doctorImage}`;

                    return (
                      <div
                        key={doctor.id}
                        className="rounded-2xl border-2 border-[#58D2DA] bg-white overflow-hidden hover:shadow-md transition-shadow">
                        {/* Doctor Image */}
                        <div className="bg-white rounded-xl h-60 flex items-center justify-center">
                          {doctor.doctorImage ? (
                            <Image
                              src={image}
                              alt={`Dr. ${getDoctorName(doctor.email)}`}
                              width={400}
                              height={192}
                              className="h-full w-full rounded-xl"
                            />
                          ) : (
                            <div className="text-5xl">
                              {doctor.gender === "female" ? "👩‍⚕️" : "👨‍⚕️"}
                            </div>
                          )}
                        </div>

                        {/* Text Section */}
                        <div className="p-6 bg-[#F7F7F7] rounded-b-xl">
                          {/* Doctor Name and Specialty */}
                          <div className="mb-4">
                            <h3 className="text-xl font-semibold mb-1 text-black">
                              Dr. {getDoctorName(doctor.email)}
                            </h3>
                            <p className="text-gray-700 text-sm">
                              {doctor.specialty}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-600">
                              Price/hour
                            </span>
                            <span className="text-2xl font-bold text-gray-900">
                              ${doctor.consultationPrice}
                            </span>
                          </div>

                          {/* Additional Info */}
                          <div className="text-xs text-gray-600 space-y-1 mb-4">
                            <div>🏥 {doctor.clinicName}</div>
                            <div>📍 {doctor.city}</div>
                            <div>
                              {doctor.consultationType === "inClinic"
                                ? "🏥 In-clinic"
                                : "🏠 Home Visit"}
                            </div>
                          </div>

                          {/* Book Now Button */}
                          <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium">
                            Book Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
