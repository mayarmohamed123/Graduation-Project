// app/search-doctors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDoctors } from "@/hook/useDoctors";
import { FilterState } from "@/types/doctors";
import { useAuthToken } from "@/hook/useAuthToken";

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
  const handleFilterChange = (
    key: keyof FilterState,
    value: string | null
  ) => {
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
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to search for doctors.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search for a Doctor
          </h1>

          {/* Search Input */}
          <div className="mt-4 max-w-md">
            <input
              type="text"
              placeholder="Search by doctor name..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700">
                  Clear All
                </button>
              </div>

              {/* Specialty Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Specialty
                </h3>
                <select
                  value={filters.specialty || ""}
                  onChange={(e) =>
                    handleFilterChange("specialty", e.target.value || null)
                  }
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                      className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                        filters.gender === gender
                          ? "bg-blue-100 border-blue-500 text-blue-700"
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
                <div className="flex gap-2">
                  {["inClinic", "homeVisit"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        handleFilterChange(
                          "consultationType",
                          type as "inClinic" | "homeVisit"
                        )
                      }
                      className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                        filters.consultationType === type
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}>
                      {type === "inClinic" ? "In-clinic" : "Home Visit"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort</h3>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="all">All</option>
                  <option value="mostRecommended">Most recommended</option>
                  <option value="priceLowToHigh">Price Low to high</option>
                  <option value="priceHighToLow">Price High to low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Doctor Image */}
                      <div className="h-48 bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        {doctor.doctorImage ? (
                          <Image
                            src={doctor.doctorImage}
                            alt={`Dr. ${getDoctorName(doctor.email)}`}
                            width={400}
                            height={192}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-4xl">
                            {doctor.gender === "female" ? "👩‍⚕️" : "👨‍⚕️"}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        {/* Doctor Name and Specialty */}
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            Dr. {getDoctorName(doctor.email)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {doctor.specialty}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500">
                            Price/hour
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            ${doctor.consultationPrice}
                          </span>
                        </div>

                        {/* Additional Info */}
                        <div className="text-xs text-gray-500 space-y-1 mb-4">
                          <div className="flex items-center gap-1">
                            <span>🏥 {doctor.clinicName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📍 {doctor.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>
                              {doctor.consultationType === "inClinic"
                                ? "🏥 In-clinic"
                                : "🏠 Home Visit"}
                            </span>
                          </div>
                        </div>

                        {/* Book Now Button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                          Book Now
                        </button>
                      </div>
                    </div>
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
