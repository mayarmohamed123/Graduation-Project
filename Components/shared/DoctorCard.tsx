"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Doctor } from "@/types";
import { FavoriteDoctor } from "@/types/favorites";
import { Heart, MessageCircle, MapPin, Phone, DollarSign, Star } from "lucide-react";
import { startConversationWithDoctor } from "@/Services/chatApi";
import { favoritesService } from "@/Services/favoritesService";
import { toast } from "react-hot-toast";
import PrimaryButton from "./PrimaryButton";

interface DoctorCardProps {
  doctor: Doctor | FavoriteDoctor;
  showChat?: boolean;
  showExtraInfo?: boolean;
  variant?: "search" | "favorite"; // New prop to determine behavior
  onRemoveFavorite?: (id: number) => void; // Callback for removing from favorites
  initialFavoriteState?: boolean; // Initial favorite state
}

export default function DoctorCard({
  doctor,
  showChat = false,
  showExtraInfo = false,
  variant = "search",
  onRemoveFavorite,
  initialFavoriteState = false,
}: DoctorCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsFavorite(initialFavoriteState);
  }, [initialFavoriteState]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingFavorite(true);
    try {
      if (variant === "favorite") {
        // In favorite page - remove from favorites
        await favoritesService.removeDoctorFromFavorites(doctor.id);
        setIsFavorite(false);
        onRemoveFavorite?.(doctor.id);
        toast.success("Doctor removed from favorites");
      } else {
        // In search page - toggle favorite
        if (isFavorite) {
          await favoritesService.removeDoctorFromFavorites(doctor.id);
          setIsFavorite(false);
          toast.success("Doctor removed from favorites");
        } else {
          await favoritesService.addDoctorToFavorites(doctor.id);
          setIsFavorite(true);
          toast.success("Doctor added to favorites");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="rounded-2xl border-2 border-primary bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Doctor Image */}
      <div className="relative h-56 bg-gradient-to-br from-blue-50 to-white">
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          disabled={isTogglingFavorite}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10 disabled:opacity-50"
          title={variant === "favorite" ? "Remove from favorites" : (isFavorite ? "Remove from favorites" : "Add to favorites")}
        >
          <Heart
            className={`w-5 h-5 ${isTogglingFavorite
              ? "text-gray-400"
              : isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
              }`}
          />
        </button>

        {/* Rating Badge */}
        {doctor.averageRating > 0 && (
          <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 z-10">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">
              {doctor.averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="h-full w-full flex items-center justify-center p-4">
          {doctor.doctorImage ? (
            <Image
              src={image}
              alt={`Dr. ${doctor.username}`}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-7xl">
              {doctor.gender === "female" ? "👩‍⚕️" : "👨‍⚕️"}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 bg-gray-50">
        {/* Doctor Name and Specialty */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
            Dr. {doctor.username}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">{doctor.specialty}</p>
        </div>

        {/* Doctor Information */}
        <div className="space-y-2 mb-4">
          {/* Price */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">
              ${doctor.consultationPrice}
            </span>
            <span className="text-gray-500">/ consultation</span>
          </div>

          {/* Clinic and Location */}
          {showExtraInfo && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="line-clamp-1">
                  {doctor.clinicName}, {doctor.city}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{doctor.clinicPhone}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
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
            <PrimaryButton fullWidth>
              Book Appointment
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
