"use client";

import React, { useEffect, useState } from "react";
import { Search, MapPin, List, Map as MapIcon, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { Pharmacy } from "@/types";
import { PharmacyCard } from "@/components/common";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";
import PageHeaderWithBack from "@/components/common/PageHeaderWithBack";

const PharmacySearchMap = dynamic(() => import("@/components/features/user/pharmacy/PharmacySearchMap"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
});

export default function PharmacySearchPage() {
    const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    const fetchAllPharmacies = async () => {
        try {
            setLoading(true);
            const data = await pharmacyService.getPharmacies();
            setFilteredPharmacies(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to load pharmacies");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchAllPharmacies();
            return;
        }

        try {
            setLoading(true);
            const data = await pharmacyService.searchPharmacies(searchQuery);
            setFilteredPharmacies(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to search pharmacies");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPharmacies();
    }, []);

    const handleUseMyLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    toast.success("Location detected!");
                    setViewMode("map");
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Could not access location");
                }
            );
        } else {
            toast.error("Geolocation not supported");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10 space-y-10">
            <PageHeaderWithBack title="Search for Pharmacies" />

            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search by pharmacy name..."
                            className="h-14 w-full rounded-full pl-6 pr-12 text-lg border-gray-200 focus:border-primary transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-all"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <Button
                        onClick={handleUseMyLocation}
                        className="h-14 px-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
                        variant="ghost"
                    >
                        <MapPin size={20} />
                        Use My Location
                    </Button>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 font-medium">
                    Found {filteredPharmacies.length} pharmacies
                </p>
                <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "list"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <List size={18} />
                        List
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "map"
                            ? "bg-primary text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <MapIcon size={18} />
                        Map
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {loading ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : viewMode === "list" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPharmacies.length > 0 ? (
                            filteredPharmacies.map(pharmacy => (
                                <PharmacyCard
                                    key={pharmacy.id}
                                    pharmacy={pharmacy}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No pharmacies found matching your search.</p>
                                <Button 
                                    variant="link" 
                                    className="text-primary mt-2"
                                    onClick={fetchAllPharmacies}
                                >
                                    View all pharmacies
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-[600px] w-full">
                        <PharmacySearchMap pharmacies={filteredPharmacies} />
                    </div>
                )}
            </div>
        </div>
    );
}
