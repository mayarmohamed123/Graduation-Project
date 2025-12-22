"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Switch from "@/Components/common/Switch";
import DoctorCard from "@/Components/features/doctor/DoctorCard";
import MedicineCard from "@/Components/common/MedicineCard";
import PageHeaderWithBack from "@/Components/common/PageHeaderWithBack";
import noFavorites from "@/assets/noFavorites.png";
import {
    FavoriteDoctor,
    FavoriteMedicine,
    FavoriteClinic,
} from "@/types/favorites";
import { favoritesService } from "@/Services/favoritesService";
import { toast } from "react-hot-toast";


export default function Favorites() {
    const [activeTab, setActiveTab] = useState("doctors");
    const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctor[]>([]);
    const [favoriteMedicines, setFavoriteMedicines] = useState<FavoriteMedicine[]>([]);
    const [favoriteClinics, setFavoriteClinics] = useState<FavoriteClinic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { id: "doctors", label: "Doctors" },
        { id: "medicine", label: "Medicine" },
    ];

    // Fetch favorites data on component mount
    useEffect(() => {
        fetchAllFavorites();
    }, []);

    const fetchAllFavorites = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [doctors, medicines, clinics] = await Promise.all([
                favoritesService.getFavoriteDoctors(),
                favoritesService.getFavoriteMedicines(),
                favoritesService.getFavoriteClinics(),
            ]);
            setFavoriteDoctors(doctors);
            setFavoriteMedicines(medicines);
            setFavoriteClinics(clinics);
        } catch (err) {
            console.error("Failed to fetch favorites:", err);
            setError(err instanceof Error ? err.message : "Failed to load favorites");
            toast.error("Failed to load favorites");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveDoctor = (id: number) => {
        // Card component already handles the API call
        // Just update local state
        setFavoriteDoctors((prev) => prev.filter((doc) => doc.id !== id));
    };

    const handleRemoveMedicine = (id: number) => {
        // Card component already handles the API call
        // Just update local state
        setFavoriteMedicines((prev) => prev.filter((med) => med.id !== id));
    };

    const handleRemoveClinic = (id: number) => {
        // Card component already handles the API call
        // Just update local state
        setFavoriteClinics((prev) => prev.filter((clinic) => clinic.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                {/* Header Section */}
                <PageHeaderWithBack title="Favorites" />

                {/* Switch Component */}
                <div className="mb-8">
                    <Switch tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchAllFavorites}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Content Area */}
                {!isLoading && !error && (
                    <div className="mt-6">
                        {/* Doctors Tab */}
                        {activeTab === "doctors" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoriteDoctors.length > 0 ? (
                                    favoriteDoctors.map((doctor) => (
                                        <DoctorCard
                                            key={doctor.id}
                                            doctor={doctor}
                                            variant="favorite"
                                            initialFavoriteState={true}
                                            onRemoveFavorite={handleRemoveDoctor}

                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 col-span-full">
                                        <Image
                                            src={noFavorites}
                                            alt="No favorites"
                                            className="mx-auto"
                                        />
                                        <p className="text-gray-500 text-xl">
                                            Your favorite doctors list is empty
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Medicine Tab */}
                        {activeTab === "medicine" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favoriteMedicines.length > 0 ? (
                                    favoriteMedicines.map((medicine) => (
                                        <MedicineCard
                                            key={medicine.id}
                                            medicine={medicine}
                                            variant="favorite"
                                            initialFavoriteState={true}
                                            onRemoveFavorite={handleRemoveMedicine}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 col-span-full">
                                        <Image
                                            src={noFavorites}
                                            alt="No favorites"
                                            className="mx-auto"
                                        />
                                        <p className="text-gray-500 text-xl">
                                            Your favorite medicines list is empty
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
