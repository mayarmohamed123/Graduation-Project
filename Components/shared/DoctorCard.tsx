"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Doctor } from "@/types";
import { Heart, MessageCircle } from "lucide-react";
import { startConversationWithDoctor } from "@/Services/chatApi";
import { toast } from "react-hot-toast";

interface DoctorCardProps {
  doctor: Doctor;
  showChat?: boolean;
  showExtraInfo?: boolean;
}

export default function DoctorCard({
  doctor,
  showChat = false,
  showExtraInfo = false,
}: DoctorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite API call
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link (though buttons shouldn't be inside links usually)
    try {
      setChatLoading(true);
      const thread = await startConversationWithDoctor(doctor.id.toString());
      router.push(`/user/chat?threadId=${thread.id}`);
      toast.success("Opening chat with doctor...");
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start chat"
      );
    } finally {
      setChatLoading(false);
    }
  };

  const image = doctor.doctorImage || "";

  return (
    <div className="rounded-2xl border-2 border-[#58D2DA] bg-white overflow-hidden hover:shadow-md transition-shadow relative">
      {/* Doctor Image */}
      <div className="bg-white rounded-xl h-60 flex items-center justify-center relative">
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {doctor.doctorImage ? (
          <Image
            src={image}
            alt={`Dr. ${doctor.username}`}
            width={400}
            height={192}
            className="h-full w-full rounded-xl object-cover"
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

        {/* Additional Info (for Search Page) */}
        {showExtraInfo && (
          <div className="text-xs text-gray-600 space-y-1 mb-4">
            <div>🏥 {doctor.clinicName}</div>
            <div>📍 {doctor.city}</div>
            <div>
              {doctor.consultationType === "inClinic"
                ? "🏥 In-clinic"
                : "🏠 Home Visit"}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {showChat && (
            <button
              onClick={handleStartChat}
              disabled={chatLoading}
              className="flex items-center justify-center gap-2 border-2 border-primary text-primary py-2 px-3 rounded-xl font-medium hover:bg-primary/10 transition disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
              {chatLoading ? "..." : "Chat"}
            </button>
          )}
          <Link href={`/user/appointment/${doctor.id}`} className="flex-1">
            <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
