"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star, Phone, DollarSign } from "lucide-react";
import {
    FavoriteDoctor,
    FavoriteMedicine,
    FavoriteClinic,
} from "@/types/favorites";
import { FavoriteCardProps } from "@/types/favorites";



export default function FavoriteCard({
    item,
    type,
    onRemove,
}: FavoriteCardProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemoveFavorite = async () => {
        setIsRemoving(true);
        try {
            // Call the parent's onRemove callback (which handles the API call)
            onRemove?.(item.id);
        } catch (error) {
            console.error("Failed to remove from favorites:", error);
        } finally {
            setIsRemoving(false);
        }
    };

    // Type guards
    const isDoctor = (
        item: FavoriteDoctor | FavoriteMedicine | FavoriteClinic
    ): item is FavoriteDoctor => type === "doctor";
    const isMedicine = (
        item: FavoriteDoctor | FavoriteMedicine | FavoriteClinic
    ): item is FavoriteMedicine => type === "medicine";
    const isClinic = (
        item: FavoriteDoctor | FavoriteMedicine | FavoriteClinic
    ): item is FavoriteClinic => type === "clinic";

    // Get image URL
    const getImageUrl = () => {
        if (isDoctor(item)) {
            return item.doctorImage || "";
        } else if (isMedicine(item)) {
            return item.imagePath?.startsWith("http")
                ? item.imagePath
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imagePath}`;
        } else if (isClinic(item)) {
            return item.imagePath?.startsWith("http")
                ? item.imagePath
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imagePath}`;
        }
        return "";
    };

    // Get card link
    const getCardLink = () => {
        if (isDoctor(item)) {
            return `/user/appointment/${item.id}`;
        } else if (isMedicine(item)) {
            return `/user/search-medicine/${item.id}`;
        } else if (isClinic(item)) {
            return `/user/clinic/${item.id}`;
        }
        return "#";
    };

    // Get title
    const getTitle = () => {
        if (isDoctor(item)) {
            return `Dr. ${item.username}`;
        } else if (isMedicine(item)) {
            return item.brandName;
        } else if (isClinic(item)) {
            return item.name;
        }
        return "";
    };

    // Get subtitle
    const getSubtitle = () => {
        if (isDoctor(item)) {
            return item.specialty;
        } else if (isMedicine(item)) {
            return item.medicationCategory;
        } else if (isClinic(item)) {
            return item.phone;
        }
        return "";
    };

    // Get rating
    const getRating = () => {
        if (isDoctor(item)) {
            return item.averageRating;
        } else if (isMedicine(item)) {
            return item.averageRating;
        }
        return null;
    };

    // Get fallback emoji
    const getFallbackEmoji = () => {
        if (isDoctor(item)) {
            return item.gender === "female" ? "👩‍⚕️" : "👨‍⚕️";
        } else if (isMedicine(item)) {
            return "💊";
        } else if (isClinic(item)) {
            return "🏥";
        }
        return "❤️";
    };

    const imageUrl = getImageUrl();
    const rating = getRating();

    return (
        <div className="rounded-2xl border-2 border-primary bg-white overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Section */}
            <div className="relative h-56 bg-gradient-to-br from-blue-50 to-white">
                {/* Remove from Favorites Button */}
                <button
                    onClick={handleRemoveFavorite}
                    disabled={isRemoving}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10 disabled:opacity-50"
                    title="Remove from favorites"
                >
                    <Heart
                        className={`w-5 h-5 ${isRemoving ? "text-gray-400" : "fill-red-500 text-red-500"
                            }`}
                    />
                </button>

                {/* Rating Badge */}
                {rating !== null && rating > 0 && (
                    <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1 z-10">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Image */}
                <div className="h-full w-full flex items-center justify-center p-4">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={getTitle()}
                            fill
                            className="object-cover rounded-xl"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="text-7xl">{getFallbackEmoji()}</div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 bg-gray-50">
                {/* Title and Subtitle */}
                <div className="mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                        {getTitle()}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{getSubtitle()}</p>
                </div>

                {/* Type-specific Information */}
                <div className="space-y-2 mb-4">
                    {isDoctor(item) && (
                        <>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-primary">
                                    ${item.consultationPrice}
                                </span>
                                <span className="text-gray-500">/ consultation</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="line-clamp-1">
                                    {item.clinicName}, {item.city}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{item.clinicPhone}</span>
                            </div>
                        </>
                    )}

                    {isMedicine(item) && (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Price:</span>
                                <span className="text-2xl font-bold text-primary">
                                    ${item.price}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Generic:</span> {item.genericName}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Strength:</span> {item.strength}{" "}
                                {item.strengthUnit}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="line-clamp-1">{item.pharmacy.name}</span>
                            </div>
                        </>
                    )}

                    {isClinic(item) && (
                        <>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{item.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="line-clamp-2">
                                    {item.address.street}, {item.address.city},{" "}
                                    {item.address.country}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Button */}
                <Link href={getCardLink()} className="block">
                    <button className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200">
                        {isDoctor(item) && "Book Appointment"}
                        {isMedicine(item) && "View Details"}
                        {isClinic(item) && "View Clinic"}
                    </button>
                </Link>
            </div>
        </div>
    );
}
