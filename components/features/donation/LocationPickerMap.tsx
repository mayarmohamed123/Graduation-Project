import { useEffect, useMemo } from "react";
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

const DEFAULT_CENTER = { lat: 30.0444, lng: 31.2357 };

export default function LocationPickerMap({ lat, lng, onChange }: LocationPickerMapProps) {
    useLeafletFix();

    const hasLocation = lat !== 0 || lng !== 0;
    const effectiveCenter = useMemo(() => hasLocation ? { lat, lng } : DEFAULT_CENTER, [lat, lng, hasLocation]);

    return (
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner relative z-0">
            <MapContainer
                center={effectiveCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler onClick={onChange} />
                {hasLocation && <Marker position={[lat, lng]} />}
                <RecenterMap center={effectiveCenter} />
            </MapContainer>
            <div className="absolute bottom-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-primary shadow-sm border border-primary/20 pointer-events-none">
                CLICK ON MAP TO SELECT LOCATION
            </div>
        </div>
    );
}
