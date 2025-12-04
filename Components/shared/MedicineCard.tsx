"use client";

import Image from "next/image";
import { Medicine } from "@/types";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = medicine.imagePath?.startsWith("http")
    ? medicine.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${medicine.imagePath}`;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Add to cart:", medicine.id);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality
  };

  const isOutOfStock = medicine.quantity === 0;

  return (
    <div className="bg-white rounded-3xl border-2 border-primary overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm">
      {/* Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-blue-50 to-white p-6">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}
        {/* Heart Icon */}
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

        {/* Medicine Image */}
        <div className="relative h-full w-full flex items-center justify-center">
          {medicine.imagePath ? (
            <Image
              src={imageUrl}
              alt={medicine.brandName}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-7xl">💊</div>
          )}
        </div>

        {/* Plus/Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-primary rounded-full p-3 shadow-lg hover:scale-110 transition-transform z-10"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Name and Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
            {medicine.brandName}
          </h3>
          <span className="text-2xl font-bold text-primary ml-3">
            ${medicine.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-1 line-clamp-2">
          {medicine.medicationCategory}
        </p>

        {/* Pack Size or Out of Stock */}
        {isOutOfStock ? (
          <div className="mb-1">
            <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-700 mb-1">
            Pack of {medicine.quantity} {medicine.dosageFormType}
            {medicine.quantity > 1 ? "s" : ""}
          </p>
        )}

        {/* Pharmacy Location */}
        <p className="text-sm text-gray-600 mb-1">
          Available at:{" "}
          <span className="font-medium text-gray-800">
            {medicine.pharmacy.name}
          </span>
        </p>

        {/* Delivery Info */}
        <p className="text-sm text-gray-500 mb-3">Delivery within 24 hours</p>

        {/* View Details Button */}
        <Link href={`/user/search-medicine/${medicine.id}`} className="block">
          <button
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-full font-medium transition-colors duration-200 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {isOutOfStock ? "Unavailable" : "View Details"}
          </button>
        </Link>
      </div>
    </div>
  );
}
