"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/Components";
import PrvButton from "@/Components/shared/prvButton";
import { Pharmacy } from "@/types";
import Image from "next/image";
import { Star } from "lucide-react";
import { pharmacyService } from "@/Services/pharmacies";

export default function Page() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        const data = await pharmacyService.getPharmacies();
        setPharmacies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <PrvButton />
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">Pharmacy</h3>
          </div>
        </div>

        {/* Pharmacy Cards */}
        <div className="flex flex-col">
          <h3 className="heading">Top Pharmacies Near You</h3>
          <p className="font-normal text-[#8E8E8E] text-xl mb-5 ">
            Find trusted pharmacies that offer quick delivery and quality
            service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => {
            const imgUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${pharmacy.imagePath}`;
            return (
              <div
                key={pharmacy.id}
                className="rounded-2xl bg-white shadow-md hover:shadow-lg transition p-4 border border-[#58D2DA]">
                {/* Image */}
                <div className="h-48 w-full rounded-xl overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={pharmacy.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Name + Rating */}
                <div className="flex justify-between items-center mt-4">
                  <h3 className="text-xl font-semibold">{pharmacy.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={18} fill="#facc15" stroke="#facc15" />
                    <span className="font-semibold text-gray-700">
                      {pharmacy.averageRating
                        ? pharmacy.averageRating.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <p className="text-gray-700 text-sm mt-1 flex items-center gap-1">
                  📍{pharmacy.city} – {pharmacy.street}
                </p>

                {/* Working Hours */}
                <p className="flex items-center gap-1 text-gray-700 text-sm">
                  🕐 Open: 8:00 AM – 12:00 AM
                </p>

                {/* Delivery */}
                <p className="flex items-center gap-1 text-gray-700 text-sm">
                  🚚 Fast delivery available
                </p>
                <p className="text-gray-700 text-sm ml-6">
                  Delivery within 24 hours
                </p>

                {/* Button */}
                <button className="mt-4 bg-[#2BBBC5] text-white w-full py-2 rounded-full font-medium">
                  Visit Pharmacy
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
