"use client";

import { useState } from "react";
import Image from "next/image";
import Switch from "@/Components/common/Switch";
import DoctorCard from "@/Components/features/doctor/DoctorCard";
import MedicineCard from "@/Components/common/MedicineCard";
import PageHeaderWithBack from "@/Components/common/PageHeaderWithBack";
import noFavorites from "@/assets/noFavorites.png";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
    const [activeTab, setActiveTab] = useState("doctors");
    const {
        favoriteDoctors,
        favoriteMedicines,
        isLoading,
        error,
        refetch,
        removeDoctor,
        removeMedicine
    } = useFavorites();

    const tabs = [
        { id: "doctors", label: "Doctors" },
        { id: "medicine", label: "Medicine" },
    ];

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
                            onClick={refetch}
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
                                            onRemoveFavorite={removeDoctor}
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
                                            onRemoveFavorite={removeMedicine}
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
