"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TopRatedDoctor } from "@/types";

export default function TopRatedDoctors() {
  const [doctors, setDoctors] = useState<TopRatedDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/review/top-doctors`
        );

        const json = await res.json();
        setDoctors(json.data);
      } catch (err) {
        console.error("Error fetching top rated doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Top Rated Doctors</h2>
        <button className="text-sm text-blue-600 hover:underline">
          See All
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => {
          const imageUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${doctor.image}`;

          return (
            <div
              key={doctor.id}
              className="rounded-2xl border border-[#58D2DA] bg-white overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="bg-white rounded-xl h-60 flex items-center justify-center overflow-hidden">
                {doctor.image ? (
                  <Image
                    src={imageUrl}
                    alt={doctor.doctorName}
                    width={400}
                    height={240}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <div className="text-5xl">👨‍⚕️</div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 bg-[#F7F7F7] rounded-b-xl space-y-3">
                {/* Name & Specialty */}
                <div>
                  <h3 className="text-xl font-semibold text-black">
                    Dr. {doctor.doctorName}
                  </h3>
                  <p className="text-gray-700 text-sm">{doctor.specialty}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < Math.round(doctor.averageRating) ? "★" : "☆"
                    )}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {doctor.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
