"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { LocateFixed, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

// Fix for default marker icon in Next.js/Webpack
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

// @ts-expect-error - _getIconUrl is internal
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface LocationMapProps {
  position: { lat: number; lng: number } | null;
  onPositionChange: (lat: number, lng: number) => void;
}

function LocationMarker({
  position,
  onPositionChange,
}: {
  position: { lat: number; lng: number } | null;
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

interface GeocodeEvent {
  geocode: {
    center: L.LatLng;
  };
}

function SearchControl({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    // @ts-expect-error - L.Control.Geocoder is added by the import
    const geocoder = L.Control.Geocoder.nominatim();
    // @ts-expect-error - L.Control.geocoder is added by the import
    const control = L.Control.geocoder({
      query: "",
      placeholder: "Search for a place...",
      defaultMarkGeocode: false,
      geocoder
    })
      .on("markgeocode", function (e: GeocodeEvent) {
        const latlng = e.geocode.center;
        onPositionChange(latlng.lat, latlng.lng);
        map.flyTo(latlng, 16);
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, onPositionChange]);

  return null;
}

export default function LocationMap({ position, onPositionChange }: LocationMapProps) {
  const [isLocating, setIsLocating] = useState(false);
  // Default center only used if no position is provided (e.g., Cairo, Egypt center)
  const defaultCenter = { lat: 30.0444, lng: 31.2357 };
  const center = position || defaultCenter;

  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    const toastId = toast.loading("Detecting your location...");

    const getPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onPositionChange(latitude, longitude);
          setIsLocating(false);
          toast.success("Location detected!", { id: toastId });
        },
        (error) => {
          console.error(`Error detecting location (highAccuracy: ${highAccuracy}):`, error);

          if (highAccuracy && (error.code === 3 || error.code === 2)) {
            // If high accuracy timed out or was unavailable, try again with low accuracy
            toast.loading("Retrying with standard accuracy...", { id: toastId });
            getPosition(false);
            return;
          }

          setIsLocating(false);
          let message = "Failed to detect location";
          if (error.code === 1) message = "Location permission denied";
          else if (error.code === 2) message = "Location unavailable";
          else if (error.code === 3) message = "Location detection timed out";

          toast.error(message, { id: toastId });
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 10000 : 15000,
          maximumAge: highAccuracy ? 0 : 30000
        }
      );
    };

    getPosition(true);
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution="Google Maps"
          // Google Maps Tiles
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <LocationMarker position={position} onPositionChange={onPositionChange} />
        <SearchControl onPositionChange={onPositionChange} />
      </MapContainer>

      {/* Use My Location Button */}
      <button
        onClick={handleUseMyLocation}
        disabled={isLocating}
        type="button"
        className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all text-primary disabled:opacity-70 group"
        title="Use my location"
      >
        {isLocating ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <LocateFixed className="h-5 w-5 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
