"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pharmacy } from "@/types";
import { Medicine } from "@/types/medicine";
import { pharmacyService } from "@/Services/pharmaciesServices";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import PharmacyMedicineList from "@/Components/features/user/pharmacy/PharmacyMedicineList";
import { Star, MapPin, Phone, Clock, MessageCircle, Truck, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { startConversationWithPharmacist } from "@/Services/chatServices";
import Image from "next/image";

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pharmacyId = parseInt(id as string, 10);

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch pharmacy first
        const pharmacyData = await pharmacyService.getPharmacyById(pharmacyId);
        setPharmacy(pharmacyData);

        // Try to fetch medicines, but don't fail if they're not available
        try {
          const medicinesData = await pharmacyService.getPharmacyMedicinesById(pharmacyId);
          setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
        } catch (medicineErr) {
          console.log("No medicines available for this pharmacy:", medicineErr);
          // Set empty array if medicines aren't available
          setMedicines([]);
        }
      } catch (err) {
        console.error("Error fetching pharmacy data:", err);
        setError("Failed to load pharmacy details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (pharmacyId) {
      fetchData();
    }
  }, [pharmacyId]);

  const handleStartChat = async () => {
    if (!pharmacy) return;
    try {
      toast.loading("Opening chat with pharmacy...", { id: "chat-loading" });
      const thread = await startConversationWithPharmacist(pharmacy.id.toString());
      router.push(`/user/chat?threadId=${thread.id}`);
      toast.success("Chat opened", { id: "chat-loading" });
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error("Failed to start chat. Please try again.", { id: "chat-loading" });
    }
  };

  const imageUrl = pharmacy?.imagePath?.startsWith("http")
    ? pharmacy.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${pharmacy?.imagePath}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block max-w-lg">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error || "Pharmacy not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Pharmacy Info */}
      <div className="bg-primary border-b border-primary-dark shadow-md h-28 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 rounded-2xl mt-4 flex items-center">
        <div className="w-full flex items-center justify-between">
          {/* Back Button & Pharmacy Name */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group"
            >
              <ChevronLeft className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              {pharmacy.imagePath && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                  <Image
                    src={imageUrl}
                    alt={pharmacy.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-white">{pharmacy.name}</h1>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                    <span className="text-sm font-medium text-white">{pharmacy.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-white/90">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{pharmacy.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>08:00 AM - 12:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery: {pharmacy.deliveryFee ? `${pharmacy.deliveryFee.toFixed(2)} EGP` : "Free"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Button */}
          <button
            onClick={handleStartChat}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Medicine List with Filtering */}
        <PharmacyMedicineList medicines={medicines} />
      </div>
    </div>
  );
}
