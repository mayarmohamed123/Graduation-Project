"use client";

import Image from "next/image";
import { Star, MapPin, Phone, MessageCircle, Truck, Info, CheckCircle2, CreditCard, ShieldCheck, Clock } from "lucide-react";
import { Pharmacy } from "@/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { startConversationWithPharmacist } from "@/Services/chatServices";

interface PharmacyHeroProps {
  pharmacy: Pharmacy;
}

export default function PharmacyHero({ pharmacy }: PharmacyHeroProps) {
  const router = useRouter();
  const imageUrl = pharmacy.imagePath?.startsWith("http")
    ? pharmacy.imagePath
    : pharmacy.imagePath?.startsWith("/") ? pharmacy.imagePath : `/${pharmacy.imagePath}`;

  const handleStartChat = async () => {
    try {
      toast.loading("Opening chat with pharmacy...", { id: "chat-loading" });
      // Using pharmacy ID as pharmacistId for context, or assuming it's the same for now
      // as per user's instruction to use this specific API
      const thread = await startConversationWithPharmacist(pharmacy.id.toString());
      router.push(`/user/chat?threadId=${thread.id}`);
      toast.success("Chat opened", { id: "chat-loading" });
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error("Failed to start chat. Please try again.", { id: "chat-loading" });
    }
  };

  const services = [
    "Home Delivery",
    "Prescription Refill",
    "Health Consultation",
    "Medical Equipment",
    "Diabetes Care"
  ];

  const acceptedInsurances = ["NextCare", "MetLife", "AXA", "GlobeMed"];

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm mb-8">
      <div className="flex flex-col md:flex-row">
        {/* Pharmacy Image */}
        <div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[250px] bg-gray-100">
          {pharmacy.imagePath ? (
            <Image
              src={imageUrl}
              alt={pharmacy.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-8xl">
              🏥
            </div>
          )}
          {/* Rating Badge Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 z-10">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">
              {pharmacy.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {pharmacy.name}
                  </h1>
                  <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-50" />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">
                    {pharmacy.street}, {pharmacy.city}, {pharmacy.country}
                  </span>
                </div>
              </div>

              {/* Chat Button */}
              <button
                onClick={handleStartChat}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-semibold">Chat Now</span>
              </button>
            </div>

            {/* About Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-900 font-bold mb-2">
                <Info className="w-4 h-4 text-primary" />
                <h3>About Pharmacy</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                {pharmacy.name} is a leading healthcare provider committed to providing
                high-quality medications and professional pharmaceutical services.
                Our experienced pharmacists are always ready to assist you with your
                medical needs and health advice.
              </p>
            </div>

            {/* Services Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {services.map((service) => (
                <span key={service} className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                  {service}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-bold text-gray-900">{pharmacy.phone}</p>
                </div>
              </div>

              {/* Delivery Fee */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Delivery</p>
                  <p className="text-sm font-bold text-gray-900">
                    {pharmacy.deliveryFee ? `${pharmacy.deliveryFee.toFixed(2)} EGP` : "Free"}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hours</p>
                  <p className="text-sm font-bold text-gray-900">08:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>

            {/* Badges/Trust Section */}
            <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-xs font-bold text-gray-700">Verified Healthcare Provider</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <div className="flex gap-1">
                  {acceptedInsurances.slice(0, 3).map(ins => (
                    <span key={ins} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
