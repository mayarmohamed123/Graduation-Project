"use client";

import { useEffect, useState } from "react";
import {useParams } from "next/navigation";
import Image from "next/image";
import { Medicine } from "@/types";
import { medicineService } from "@/Services/medicineServices";
import { cartService } from "@/Services/cartService";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import PrvButton from "@/Components/common/prvButton";
import { Heart, Check, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";

export default function MedicineDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await medicineService.getMedicineById(Number(id));
        setMedicine(data);
      } catch (err) {
        console.error("Error fetching medicine details:", err);
        setError("Failed to load medicine details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicine();
    }
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite API call
  };

  const handleAddToCart = async () => {
    if (!medicine) return;
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        medicationId: medicine.id,
        pharmacyId: medicine.pharmacy.id,
        quantity: 1,
      });
      // Refresh cart to update count
      await dispatch(fetchUserCart());
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg mb-4">{error || "Medicine not found"}</p>
        <PrvButton />
      </div>
    );
  }

  const imageUrl = medicine.imagePath?.startsWith("http")
    ? medicine.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${medicine.imagePath}`;

  const isOutOfStock = medicine.quantity === 0;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <PrvButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column: Image */}
          <div className="relative bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center shadow-sm h-[500px]">
             {/* Favorite Button */}
             <button
              onClick={toggleFavorite}
              className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-md hover:scale-110 transition-transform z-10"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </button>
            
            <div className="relative w-full h-full">
              {medicine.imagePath ? (
                <Image
                  src={imageUrl}
                  alt={medicine.brandName}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-9xl">
                  💊
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {medicine.brandName}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {medicine.medicationCategory}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Pack Size:</span>
                <span>{medicine.quantity} {medicine.dosageFormType}s</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Availability:</span>
                {isOutOfStock ? (
                   <span className="text-red-600 font-medium">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-medium">
                    In Stock (Available at {medicine.pharmacy.name})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                 <span className="font-medium">Delivery:</span>
                 <span>Within 24 hours</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button 
                className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isOutOfStock}
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className="flex-1 border-2 border-primary text-primary py-3 px-6 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div className="space-y-8 max-w-4xl">
          {/* Description */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {medicine.description}
            </p>
          </section>

          {/* Composition */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Composition / Ingredients</h2>
            <p className="text-gray-700 leading-relaxed">
              {medicine.composition}
            </p>
          </section>

           {/* Directions */}
           <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Directions for Use</h2>
            <p className="text-gray-700 leading-relaxed">
              {medicine.directionsForUse}
            </p>
          </section>

          {/* Warnings */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Warnings</h2>
            <p className="text-gray-700 leading-relaxed">
              {medicine.warning}
            </p>
          </section>

          {/* Suitable For */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Suitable For / Not Suitable For</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Suitable for:</span> {medicine.suitableFor}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-medium">Not suitable for:</span> {medicine.notSuitableFor}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
