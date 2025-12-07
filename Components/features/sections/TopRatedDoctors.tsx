"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DoctorCard from "../doctor/DoctorCard";

export default function TopRatedDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors/top-rated");

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const json = await res.json();
        setDoctors(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Error fetching top rated doctors:", err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl font-semibold text-primary">
          Top Rated Doctors
        </h2>
        <Link href="/user/search-doctors">
          <button className="text-sm text-primary hover:underline">
            See All
          </button>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} showChat={true} />
        ))}
      </div>
    </div>
  );
}
