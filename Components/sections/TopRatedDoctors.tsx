"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Doctor } from "@/types";
import { LoadingSpinner } from "../shared";
import Link from "next/link";

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
    <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4">
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
                    alt={`Dr. ${doctor.username}`}
                    width={400}
                    height={192}
                    // style={{ width: "auto", height: "auto" }}
                    className="h-full w-full rounded-xl"
                    priority
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
                    Dr. {doctor.username}
                  </h3>
                  <p className="text-gray-700 text-sm">{doctor.specialty}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Price/hour</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${doctor.consultationPrice}
                  </span>
                </div>

                {/* Book Now Button */}
                <Link href={`/user/appointment/${doctor.id}`}>
                  <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
