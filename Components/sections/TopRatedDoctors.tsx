"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Doctor } from "@/types";
import { LoadingSpinner } from "../shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startConversationWithDoctor } from "@/Services/chatApi";
import { toast } from "react-hot-toast";
import { MessageCircle } from "lucide-react";

export default function TopRatedDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatLoadingId, setChatLoadingId] = useState<number | null>(null);
  const router = useRouter();

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

  const handleStartChat = async (doctorId: number) => {
    try {
      setChatLoadingId(doctorId);
      const thread = await startConversationWithDoctor(doctorId.toString());
      router.push(`/user/chat?threadId=${thread.id}`);
      toast.success("Opening chat with doctor...");
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start chat"
      );
    } finally {
      setChatLoadingId(null);
    }
  };

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
        {doctors.map((doctor) => {
          const image = `${doctor.doctorImage}`;

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

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartChat(doctor.id)}
                    disabled={chatLoadingId === doctor.id}
                    className="flex items-center justify-center gap-2 border-2 border-primary text-primary py-2 px-3 rounded-xl font-medium hover:bg-primary/10 transition disabled:opacity-50">
                    <MessageCircle className="w-5 h-5" />
                    {chatLoadingId === doctor.id ? "..." : "Chat"}
                  </button>
                  <Link href={`/user/appointment/${doctor.id}`} className="flex-1">
                    <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
