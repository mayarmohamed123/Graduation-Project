"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pharmacy, Review } from "@/types";
import { Medicine } from "@/types/medicine";
import { pharmacyService } from "@/Services/pharmaciesServices";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PharmacyMedicineList from "@/components/features/user/pharmacy/PharmacyMedicineList";
import PharmacySidebar from "@/components/features/user/pharmacy/PharmacySidebar";
import PharmacyReviewsTab from "@/components/features/user/pharmacy/PharmacyReviewsTab";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { startConversationWithPharmacist } from "@/Services/chatServices";

type TabType = "Medicines" | "Pharmacy Info" | "Reviews";

export default function PharmacyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pharmacyId = parseInt(id as string, 10);
 
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Medicines");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [pharmacyData, medicinesData, reviewsData] = await Promise.all([
        pharmacyService.getPharmacyById(pharmacyId),
        pharmacyService.getPharmacyMedicinesById(pharmacyId).catch(() => []),
        pharmacyService.getPharmacyReviews(pharmacyId).catch(() => []),
      ]);
      
      setPharmacy(pharmacyData);
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("Error fetching pharmacy data:", err);
      setError("Failed to load pharmacy details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [pharmacyId]);

  useEffect(() => {
    if (pharmacyId) {
      fetchData();
    }
  }, [pharmacyId, fetchData]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-3xl text-center max-w-md shadow-sm">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-6">{error || "Pharmacy not found."}</p>
          <button onClick={() => router.back()} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const tabs: TabType[] = ["Medicines", "Pharmacy Info", "Reviews"];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Top Header/Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Pharmacies
          </button>

          <button
            onClick={handleStartChat}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all text-sm font-bold shadow-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with Pharmacist</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Sidebar */}
          <PharmacySidebar pharmacy={pharmacy} onMessage={handleStartChat} />

          {/* Main Content */}
          <div className="flex-1 w-full lg:min-w-0">
            {/* Tabs Header */}
            <div className="flex items-center gap-8 border-b border-gray-100 mb-8 overflow-x-auto pb-1 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="w-full">
              {activeTab === "Medicines" && (
                <PharmacyMedicineList medicines={medicines} />
              )}
              {activeTab === "Pharmacy Info" && (
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">Pharmacy Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Branch Name</h4>
                      <p className="text-gray-700 font-medium">{pharmacy.name} - {pharmacy.city} Branch</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</h4>
                      <p className="text-gray-700 font-medium">{pharmacy.street}, {pharmacy.city}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Opening Hours</h4>
                      <p className="text-gray-700 font-medium">Open 24/7 (Always Available)</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery</h4>
                      <p className="text-gray-700 font-medium">Estimated 30-60 mins delivery time</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">About the Pharmacy</h4>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {pharmacy.name} is a leading healthcare provider dedicated to offering high-quality pharmaceutical services. Our team of expert pharmacists is available 24/7 to assist you with your medication needs and health inquiries.
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "Reviews" && (
                <PharmacyReviewsTab 
                  pharmacyId={pharmacyId}
                  reviews={reviews} 
                  totalRating={pharmacy.averageRating}
                  onRefresh={fetchData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
