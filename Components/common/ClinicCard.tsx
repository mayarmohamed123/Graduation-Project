"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteClinic } from "@/types/favorites";
import { Heart, MapPin, Phone } from "lucide-react";
import { favoritesService } from "@/services/favoritesService";
import { toast } from "react-hot-toast";
import PrimaryButton from "./PrimaryButton";

interface ClinicCardProps {
    clinic: FavoriteClinic;
    variant?: "search" | "favorite";
    onRemoveFavorite?: (id: number) => void;
    initialFavoriteState?: boolean;
}

export default function ClinicCard({
    clinic,
    variant = "search",
    onRemoveFavorite,
    initialFavoriteState = false,
}: ClinicCardProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    useEffect(() => {
        setIsFavorite(initialFavoriteState);
    }, [initialFavoriteState]);

    const imageUrl = clinic.imagePath?.startsWith("http")
        ? clinic.imagePath
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${clinic.imagePath}`;

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsTogglingFavorite(true);
        try {
            if (variant === "favorite") {
                await favoritesService.removeClinicFromFavorites(clinic.id);
                setIsFavorite(false);
                onRemoveFavorite?.(clinic.id);
                toast.success("Clinic removed from favorites");
            } else {
                if (isFavorite) {
                    await favoritesService.removeClinicFromFavorites(clinic.id);
                    setIsFavorite(false);
                    toast.success("Clinic removed from favorites");
                } else {
                    await favoritesService.addClinicToFavorites(clinic.id);
                    setIsFavorite(true);
                    toast.success("Clinic added to favorites");
                }
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            toast.error("Failed to update favorites");
        } finally {
            setIsTogglingFavorite(false);
        }
    };

    return (
        <div className="rounded-2xl border-2 border-primary bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Clinic Image */}
            <div className="relative h-56 bg-gradient-to-br from-blue-50 to-white">
                {/* Favorite Button */}
                <button
                    onClick={toggleFavorite}
                    disabled={isTogglingFavorite}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10 disabled:opacity-50"
                    title={
                        variant === "favorite"
                            ? "Remove from favorites"
                            : isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                    }
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

                {/* Image */}
                <div className="h-full w-full flex items-center justify-center p-4">
                    {clinic.imagePath ? (
                        <Image
                            src={imageUrl}
                            alt={clinic.name}
                            fill
                            className="object-cover rounded-xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="text-7xl">🏥</div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 bg-gray-50">
                {/* Clinic Name */}
                <div className="mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                        {clinic.name}
                    </h3>
                </div>

                {/* Clinic Information */}
                <div className="space-y-2 mb-4">
                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{clinic.phone}</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="line-clamp-2">
                            {clinic.address.street}, {clinic.address.city},{" "}
                            {clinic.address.country}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <Link href={`/user/clinic/${clinic.id}`} className="block">
                    <PrimaryButton fullWidth>
                        View Clinic
                    </PrimaryButton>
                </Link>
            </div>
        </div>
    );
}
