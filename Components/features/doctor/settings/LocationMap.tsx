"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
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
  // Default center only used if no position is provided (e.g., Cairo, Egypt center)
  const defaultCenter = { lat: 30.0444, lng: 31.2357 };
  const center = position || defaultCenter;

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
    </div>
  );
}
