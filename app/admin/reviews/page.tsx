"use client";

import { useState } from "react";
import EntityReviewManager from "@/Components/features/admin/reviews/EntityReviewManager";
import { adminService } from "@/Services/admin/adminService";
import { doctorService } from "@/Services/doctorService";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { medicineService } from "@/Services/medicineServices";
import { User, Building2, Pill } from "lucide-react";

type Tab = "doctors" | "pharmacies" | "medicines";

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("doctors");

  const tabs = [
    { id: "doctors", label: "Doctors", icon: User },
    { id: "pharmacies", label: "Pharmacies", icon: Building2 },
    { id: "medicines", label: "Medicines", icon: Pill },
  ] as const;

  const fetchDoctorEntities = async () => {
    const doctors = await adminService.getAllDoctors();
    return doctors.map((d) => ({
      id: d.id,
      name: d.username,
      image: d.doctorImage,
      subtext: d.specialty,
    }));
  };

  const fetchPharmacyEntities = async () => {
    const pharmacies = await pharmacyService.getPharmacies();
    return pharmacies.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.imagePath,
      subtext: p.city,
    }));
  };

  const fetchMedicineEntities = async () => {
    // Since there's no "get all medicines" for admin, we'll use filter with empty params
    const medicines = await medicineService.filterMedicines({});
    return medicines.map((m) => ({
      id: m.id,
      name: m.brandName,
      image: m.imagePath,
      subtext: m.dosageFormType,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 font-outfit">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reviews Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage reviews across the platform</p>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 transition-all duration-300">
        {activeTab === "doctors" && (
          <EntityReviewManager
            type="doctor"
            fetchEntities={fetchDoctorEntities}
            fetchReviews={doctorService.GetDoctorReviews}
            deleteReview={pharmacyService.deleteReview}
          />
        )}

        {activeTab === "pharmacies" && (
          <EntityReviewManager
            type="pharmacy"
            fetchEntities={fetchPharmacyEntities}
            fetchReviews={pharmacyService.getPharmacyReviews}
            deleteReview={pharmacyService.deleteReview}
          />
        )}

        {activeTab === "medicines" && (
          <EntityReviewManager
            type="medicine"
            fetchEntities={fetchMedicineEntities}
            fetchReviews={pharmacyService.getMedicineReviews}
            deleteReview={pharmacyService.deleteReview}
          />
        )}
      </div>
    </div>
  );
}
