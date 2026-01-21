"use client";

import { useEffect, useState } from "react";
import { Doctor } from "@/types/doctors";
import { Pharmacy } from "@/types";
import { doctorService } from "@/Services/doctorService";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { MapPin, ShieldCheck, Clock, Search, ArrowRight } from "lucide-react";
import PrimaryButton from "@/Components/common/PrimaryButton";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("../../common/HomeProvidersMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">
            Loading Map...
        </div>
    ),
});

export default function HomeMapSection() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

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
            }
        };

        fetchData();
    }, []);

    const features = [
        {
            icon: <Clock className="w-5 h-5 text-primary" />,
            text: "Live Map View – See providers in real time",
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-primary" />,
            text: "Verified Healthcare Providers – Trusted and licensed only",
        },
        {
            icon: <MapPin className="w-5 h-5 text-primary" />,
            text: "Nearby Results – Find the closest services instantly",
        },
        {
            icon: <Search className="w-5 h-5 text-primary" />,
            text: "Smart Filters – Doctors, pharmacies, specialties, and more",
        },
    ];

    return (
        <section className="w-full max-w-6xl mx-auto py-16 px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side: Content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                            Find <span className="text-primary">Doctors & Pharmacies</span>{" "}
                            Near You
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Explore verified doctors and licensed pharmacies around your
                            location. View details, distance, and availability directly on the
                            map.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full shrink-0">
                                    {feature.icon}
                                </div>
                                <span className="text-gray-700 font-medium">
                                    {feature.text}
                                </span >
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <Link href="/user/map">
                            <PrimaryButton className="px-8 py-3 flex items-center gap-2 group">
                                Explore Map
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </PrimaryButton>
                        </Link>
                    </div>
                </div>

                {/* Right Side: Map */}
                <div className="h-[400px] md:h-[500px] w-full bg-white rounded-2xl shadow-xl p-2 border border-blue-50 relative">
                    <MapWithNoSSR doctors={doctors} pharmacies={pharmacies} />

                    {/* Legend Overlay */}
                    <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-primary border border-white shadow-sm"></div>
                            <span className="font-semibold text-gray-700">Doctors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm"></div>
                            <span className="font-semibold text-gray-700">Pharmacies</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
