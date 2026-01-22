"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctors";
import { Pharmacy } from "@/types";
import { doctorService } from "@/Services/doctorService";
import { pharmacyService } from "@/Services/pharmaciesServices";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Stethoscope, Pill, Search } from "lucide-react";
import LoadingSpinner from "@/Components/common/LoadingSpinner";

// Dynamically import the map
const HomeProvidersMap = dynamic(() => import("@/Components/common/HomeProvidersMap"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
});

export default function MapPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsData, pharmaciesData] = await Promise.all([
                    doctorService.getAllDoctors(),
                    pharmacyService.getPharmacies(),
                ]);
                setDoctors(doctorsData);
                setPharmacies(Array.isArray(pharmaciesData) ? pharmaciesData : []);
            } catch (error) {
                console.error("Failed to fetch map data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const uniqueSpecialties = Array.from(
        new Set(doctors.map((d) => d.specialty).filter(Boolean))
    );

    // Filter providers based on search query and specialty
    const filteredDoctors = doctors.filter((doc) => {
        const matchesSearch =
            doc.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.clinicName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = selectedSpecialty
            ? doc.specialty === selectedSpecialty
            : true;
        return matchesSearch && matchesSpecialty;
    });

    const filteredPharmacies = pharmacies.filter((pharma) =>
        pharma.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Floating Header with Search */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 max-w-sm w-full">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 w-full transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/user">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 className="font-bold text-gray-800 text-lg">Explore Providers</h1>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                            placeholder="Search by name or clinic name ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Specialty Filter */}
                    <div className="mb-4">
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                        >
                            <option value="">All Specialties</option>
                            {uniqueSpecialties.map((specialty) => (
                                <option key={specialty} value={specialty}>
                                    {specialty}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 text-xs">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${filteredDoctors.length > 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                            <Stethoscope size={14} />
                            <span className="font-medium">
                                {filteredDoctors.filter(d => d.latitude && d.longitude).length} / {filteredDoctors.length} Doctors
                            </span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${filteredPharmacies.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                            <Pill size={14} />
                            <span className="font-medium">
                                {filteredPharmacies.filter(p => p.latitude && p.longitude).length} / {filteredPharmacies.length} Pharmacies
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <HomeProvidersMap doctors={filteredDoctors} pharmacies={filteredPharmacies} />
        </div>
    );
}
