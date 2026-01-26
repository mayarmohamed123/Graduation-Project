"use client";

import Image from "next/image";
import { Star, MapPin, Phone, MessageCircle, Navigation } from "lucide-react";
import { Pharmacy } from "@/types";
import { Button } from "@/Components/ui";

interface PharmacySidebarProps {
  pharmacy: Pharmacy;
  onMessage: () => void;
}

export default function PharmacySidebar({ pharmacy, onMessage }: PharmacySidebarProps) {
  const imageUrl = pharmacy.imagePath?.startsWith("http")
    ? pharmacy.imagePath
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${pharmacy.imagePath}`;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      <div className="bg-primary rounded-[32px] p-6 shadow-xl border border-primary/20 flex flex-col items-center text-white">
        {/* Pharmacy Logo/Image */}
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden mb-6 shadow-lg border-4 border-white/20">
          {pharmacy.imagePath ? (
            <Image
              src={imageUrl}
              alt={pharmacy.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-5xl">
              🏥
            </div>
          )}
        </div>

        {/* Pharmacy Name & Verification */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{pharmacy.name}</h1>
            <div className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
          </div>
          <p className="text-white/80 font-medium">{pharmacy.city} Branch, {pharmacy.country}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold border border-white/20">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-2"></span>
            OPEN NOW (24/7)
          </div>
        </div>

        {/* Info Grid */}
        <div className="w-full space-y-5 py-6 border-t border-white/10">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Address</p>
              <p className="text-sm text-white font-medium leading-normal">
                {pharmacy.street}, {pharmacy.city}, {pharmacy.postalCode}, {pharmacy.country}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Phone</p>
              <p className="text-sm text-white font-medium">{pharmacy.phone}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-0.5">Rating</p>
              <p className="text-sm text-white font-medium">
                {pharmacy.averageRating.toFixed(1)} <span className="text-white/50 font-normal ml-1">(1.2k Reviews)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 mt-4">
          <Button 
            onClick={onMessage}
            className="w-full py-6 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/5"
          >
            <MessageCircle className="w-5 h-5" />
            Message Pharmacy
          </Button>
          <Button 
            onClick={handleDirections}
            variant="outline"
            className="w-full py-6 rounded-2xl border-white/20 bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all shadow-sm backdrop-blur-sm"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Map Preview Area */}
      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 h-48 relative group cursor-pointer" onClick={handleDirections}>
         <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400')] bg-cover"></div>
            <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-gray-700">
               View Map
            </div>
         </div>
      </div>
    </div>
  );
}
