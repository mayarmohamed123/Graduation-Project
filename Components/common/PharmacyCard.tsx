"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock } from "lucide-react";
import { Pharmacy } from "@/types";
import PrimaryButton from "./PrimaryButton";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
}

export default function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const imageUrl = pharmacy.imagePath?.startsWith("http")
    ? pharmacy.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${pharmacy.imagePath}`;

  return (
    <div className="rounded-2xl border-2 border-[#D0F1F3] bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Pharmacy Image */}
      <div className="relative h-48 bg-gray-100">
        {pharmacy.imagePath ? (
          <Image
            src={imageUrl}
            alt={pharmacy.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-6xl">
            🏥
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 bg-white">
        {/* Name and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {pharmacy.name}
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">
              {pharmacy.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
          <p className="text-sm line-clamp-2">
            {pharmacy.city}, {pharmacy.street}
          </p>
        </div>

        {/* Opening Hours */}
        <div className="flex items-center gap-2 mb-2 text-gray-600">
          <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
          <p className="text-sm">Open: 8:00 AM - 12:00 AM</p>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              🚚 Fast delivery available
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Delivery within 24 hours
        </p>

        {/* Visit Button */}
        <Link href={`/user/pharmacy/${pharmacy.id}`} className="block">
          <PrimaryButton fullWidth>
            Visit Pharmacy
          </PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
