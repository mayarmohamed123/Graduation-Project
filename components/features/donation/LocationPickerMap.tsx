import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
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

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

function RecenterMap({ center }: { center: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function LocationPickerMap({ lat, lng, onChange }: LocationPickerMapProps) {
    useLeafletFix();
    const [initialLocationSet, setInitialLocationSet] = useState(false);

    useEffect(() => {
        if (!initialLocationSet && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onChange(position.coords.latitude, position.coords.longitude);
                    setInitialLocationSet(true);
                },
                (error) => {
                    console.log("Location access denied or error:", error);
                    setInitialLocationSet(true);
                }
            );
        } else if (!initialLocationSet) {
            // Use a timeout to avoid synchronous setState inside useEffect
            const timer = setTimeout(() => setInitialLocationSet(true), 0);
            return () => clearTimeout(timer);
        }
    }, [initialLocationSet, onChange]);

    return (
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner relative z-0">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler onClick={onChange} />
                <Marker position={[lat, lng]} />
                <RecenterMap center={{ lat, lng }} />
            </MapContainer>
            <div className="absolute bottom-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary shadow-sm border border-primary/20 pointer-events-none">
                CLICK ON MAP TO SELECT LOCATION
            </div>
        </div>
    );
}
