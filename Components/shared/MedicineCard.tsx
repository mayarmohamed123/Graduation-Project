"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Medicine } from "@/types";
import { FavoriteMedicine } from "@/types/favorites";
import { Heart, Plus, Loader2, Star, MapPin } from "lucide-react";
import { cartService } from "@/Services/cartService";
import { favoritesService } from "@/Services/favoritesService";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { toast } from "react-hot-toast";

interface MedicineCardProps {
  medicine: Medicine | FavoriteMedicine;
  variant?: "search" | "favorite";
  onRemoveFavorite?: (id: number) => void;
  initialFavoriteState?: boolean;
}

export default function MedicineCard({
  medicine,
  variant = "search",
  onRemoveFavorite,
  initialFavoriteState = false,
}: MedicineCardProps) {
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(initialFavoriteState);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);

  // Check if medicine is in favorites on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorites = await favoritesService.getFavoriteMedicines();
        const isFav = favorites.some((fav) => fav.id === medicine.id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Failed to check favorite status:", error);
        // If error, fall back to initialFavoriteState
        setIsFavorite(initialFavoriteState);
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    // Only check if variant is "search" (not already on favorites page)
    if (variant === "search") {
      checkFavoriteStatus();
    } else {
      setIsFavorite(initialFavoriteState);
      setIsCheckingFavorite(false);
    }
  }, [medicine.id, variant, initialFavoriteState]);

  useEffect(() => {
    setIsFavorite(initialFavoriteState);
  }, [initialFavoriteState]);

  const imageUrl = medicine.imagePath?.startsWith("http")
    ? medicine.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${medicine.imagePath}`;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingFavorite(true);
    try {
      if (variant === "favorite") {
        await favoritesService.removeMedicineFromFavorites(medicine.id);
        setIsFavorite(false);
        onRemoveFavorite?.(medicine.id);
        toast.success("Medicine removed from favorites");
      } else {
        if (isFavorite) {
          await favoritesService.removeMedicineFromFavorites(medicine.id);
          setIsFavorite(false);
          toast.success("Medicine removed from favorites");
        } else {
          await favoritesService.addMedicineToFavorites(medicine.id);
          setIsFavorite(true);
          toast.success("Medicine added to favorites");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        medicationId: medicine.id,
        pharmacyId: medicine.pharmacy.id,
        quantity: 1,
      });
      await dispatch(fetchUserCart());
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = medicine.quantity === 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-primary overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-40 bg-gradient-to-br from-blue-50 to-white p-4">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          disabled={isTogglingFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform z-10 disabled:opacity-50"
          title={variant === "favorite" ? "Remove from favorites" : (isFavorite ? "Remove from favorites" : "Add to favorites")}
        >
          <Heart
            className={`w-4 h-4 ${isTogglingFavorite
              ? "text-gray-400"
              : isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
              }`}
          />
        </button>

        {/* Rating Badge */}
        {medicine.averageRating > 0 && (
          <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-0.5 shadow-md flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-900">
              {medicine.averageRating.toFixed(1)}
            </span>
          </div>
        )}

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

        {/* Add to Cart Button */}
        {!isOutOfStock && variant === "search" && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="absolute bottom-3 right-3 bg-primary rounded-full p-2 shadow-lg hover:scale-110 transition-transform z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 bg-gray-50">
        {/* Name and Price */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-0.5 line-clamp-1">
            {medicine.brandName}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">
            {medicine.medicationCategory}
          </p>
        </div>

        {/* Medicine Information */}
        <div className="space-y-1.5 mb-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="text-xl font-bold text-primary">
              ${medicine.price}
            </span>
          </div>

          {/* Generic Name */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Generic:</span> {medicine.genericName}
          </div>

          {/* Strength */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Strength:</span> {medicine.strength}{" "}
            {medicine.strengthUnit}
          </div>

          {/* Pharmacy */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{medicine.pharmacy.name}</span>
          </div>

          {/* Stock Status */}
          {isOutOfStock ? (
            <div>
              <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              Pack of {medicine.quantity} {medicine.dosageFormType}
              {medicine.quantity > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* View Details Button */}
        <Link href={`/user/search-medicine/${medicine.id}`} className="block">
          <button
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-medium transition-colors duration-200 ${isOutOfStock
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
