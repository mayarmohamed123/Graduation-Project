"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, ExternalLink, Building2 } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { Pharmacy } from "@/types";

interface PharmacySearchMapProps {
    pharmacies: Pharmacy[];
}

// Custom hook to fix Leaflet SSR issues
const useLeafletFix = () => {
    useEffect(() => {
        // @ts-expect-error - _getIconUrl is internal
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }, []);
};

function RecenterMap({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function PharmacySearchMap({ pharmacies }: PharmacySearchMapProps) {
    useLeafletFix();
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const defaultCenter = { lat: 30.0444, lng: 31.2357 }; // Cairo

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.log("Location access denied or error:", error)
            );
        }
    }, []);

    const createCustomIcon = () => {
        const iconMarkup = renderToStaticMarkup(
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-white">
                <Building2 size={20} className="text-white" />
            </div>
        );

        return L.divIcon({
            html: iconMarkup,
            className: "custom-marker-icon",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
        });
    };

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

                {pharmacies.map((pharmacy) => {
                    if (!pharmacy.latitude || !pharmacy.longitude) return null;
                    return (
                        <Marker
                            key={pharmacy.id}
                            position={[pharmacy.latitude, pharmacy.longitude]}
                            icon={createCustomIcon()}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[220px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Building2 size={16} className="text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                                {pharmacy.name}
                                            </h3>
                                            <p className="text-xs text-primary font-medium">
                                                ★ {pharmacy.averageRating.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                                        <MapPin size={12} className="shrink-0" />
                                        <p>{pharmacy.street}, {pharmacy.city}</p>
                                    </div>

                                    <button
                                        onClick={() => openGoogleMaps(pharmacy.latitude!, pharmacy.longitude!)}
                                        className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        Get Directions
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
