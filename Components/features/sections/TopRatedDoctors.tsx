"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types";
import Link from "next/link";
import { doctorService } from "@/Services/doctorService";
import DoctorCard from "../doctor/DoctorCard";
import { Loader2 } from "lucide-react";

export default function TopRatedDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getTopRatedDoctors();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching top rated doctors:", err);
        setError("Failed to load doctors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (doctors.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 md:mt-20 pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
          Top Rated Doctors
        </h2>
        <Link href="/user/search-doctors">
          <span className="text-sm text-primary hover:underline cursor-pointer">
            See All
          </span>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

