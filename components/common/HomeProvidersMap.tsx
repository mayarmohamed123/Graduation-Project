"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Doctor } from "@/types/doctors";
import { Pharmacy } from "@/types";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Stethoscope, Pill, MapPin, Navigation, Clock, ExternalLink } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import toast from "react-hot-toast";
import Link from "next/link";

interface HomeProvidersMapProps {
    doctors: Doctor[];
    pharmacies: Pharmacy[];
}

// Custom hook to fix Leaflet SSR issues
const useLeafletFix = () => {
    useEffect(() => {
        // @ts-expect-error - _getIconUrl is internal
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }, []);
};

// Component to handle map centering
function RecenterMap({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function HomeProvidersMap({
    doctors,
    pharmacies,
}: HomeProvidersMapProps) {
    useLeafletFix();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Cairo Center Default
    const defaultCenter = { lat: 30.0444, lng: 31.2357 };

    useEffect(() => {
        // Try to get user location on mount
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("Location access denied or error:", error);
                }
            );
        }
    }, []);

    // Calculate distance in km
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLng = deg2rad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    // Estimate time (assuming avg speed 40km/h in city)
    const estimateTime = (distance: number) => {
        const speed = 40; // km/h
        const totalMinutes = Math.round((distance / speed) * 60);

        if (totalMinutes < 60) {
            return `${totalMinutes} mins`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes === 0) return `${hours} hours`;
        return `${hours} hours ${minutes} mins`;
    };

    // Create custom icons using Lucide and DivIcon
    const createCustomIcon = (type: "doctor" | "pharmacy") => {
        const iconMarkup = renderToStaticMarkup(
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${type === "doctor" ? "bg-primary text-white" : "bg-emerald-500 text-white"
                    }`}
            >
                {type === "doctor" ? (
                    <Stethoscope size={20} />
                ) : (
                    <Pill size={20} />
                )}
            </div>
        );

        return L.divIcon({
            html: iconMarkup,
            className: "custom-marker-icon", // We'll need to ensure this class doesn't override layout
            iconSize: [40, 40],
            iconAnchor: [20, 40], // Center bottom
            popupAnchor: [0, -40],
        });
    };

    const doctorIcon = createCustomIcon("doctor");
    const pharmacyIcon = createCustomIcon("pharmacy");

    const openGoogleMaps = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative z-0">
            <MapContainer
                center={userLocation || defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && <RecenterMap center={userLocation} />}

                {/* User Marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={L.divIcon({
                            html: renderToStaticMarkup(
                                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-animation"></div>
                            ),
                            className: "user-marker",
                            iconSize: [24, 24],
                        })}
                    >
                        <Popup>You are here</Popup>
                    </Marker>
                )}

                {/* Doctor Markers */}
                {doctors.map(
                    (doc) =>
                        doc.latitude &&
                        doc.longitude && (
                            <Marker
                                key={`doc-${doc.id}`}
                                position={[doc.latitude, doc.longitude]}
                                icon={doctorIcon}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[220px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Stethoscope size={16} />
                                            </div>

                                            <div className="flex flex-col justify-center leading-tight ">
                                                <h3 className="font-semibold text-gray-900 text-sm hover:text-primary transition-colors leading-tight">
                                                    <Link href={`/user/appointment/${doc.id}`}>
                                                        Dr. {doc.username}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-primary leading-tight">
                                                    {doc.specialty}
                                                </p>
                                            </div>
                                        </div>


                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2 ">
                                            <MapPin size={12} className="mt-0.5 shrink-0" />
                                            <p>{doc.clinicName || doc.city || "Clinic"}</p>
                                        </div>

                                        {userLocation && (
                                            <div className="flex items-center gap-4 mb-3 bg-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Navigation size={12} className="text-blue-500" />
                                                    <span>{calculateDistance(userLocation.lat, userLocation.lng, doc.latitude, doc.longitude).toFixed(1)} km</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Clock size={12} className="text-orange-500" />
                                                    <span>~{estimateTime(calculateDistance(userLocation.lat, userLocation.lng, doc.latitude, doc.longitude))}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => openGoogleMaps(doc.latitude, doc.longitude)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                            Get Directions
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                )}

                {/* Pharmacy Markers */}
                {pharmacies.map(
                    (pharma) =>
                        pharma.latitude &&
                        pharma.longitude && (
                            <Marker
                                key={`pharma-${pharma.id}`}
                                position={[pharma.latitude, pharma.longitude]}
                                icon={pharmacyIcon}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[220px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                <Pill size={16} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm hover:text-emerald-600 transition-colors">
                                                    <Link href={`/user/pharmacy/${pharma.id}`}>
                                                        {pharma.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-emerald-600">Pharmacy</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-1.5 text-gray-500 text-xs mb-2">
                                            <MapPin size={12} className="mt-0.5 shrink-0" />
                                            <p>{pharma.city}, {pharma.street || "Main St."}</p>
                                        </div>

                                        {userLocation && (
                                            <div className="flex items-center gap-4 mb-3 bg-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Navigation size={12} className="text-blue-500" />
                                                    <span>{calculateDistance(userLocation.lat, userLocation.lng, pharma.latitude, pharma.longitude).toFixed(1)} km</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    <Clock size={12} className="text-orange-500" />
                                                    <span>~{estimateTime(calculateDistance(userLocation.lat, userLocation.lng, pharma.latitude, pharma.longitude))}</span>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => openGoogleMaps(pharma.latitude, pharma.longitude)}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                            Get Directions
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                )}
            </MapContainer>
        </div >
    );
}
