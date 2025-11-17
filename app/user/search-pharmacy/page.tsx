import { SearchInput } from "@/Components";
import PrvButton from "@/Components/shared/prvButton";
import { Pharmacy } from "@/types";
import Image from "next/image";
import { Star, MapPin, Clock, Truck } from "lucide-react";

async function getPharmacies(): Promise<Pharmacy[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to load pharmacies");

  const json = await res.json();
  return json.data || json;
}

export default async function Page() {
  const pharmacies = await getPharmacies();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <PrvButton />
            <h3 className="text-4xl font-semibold text-gray-900">Pharmacy</h3>
          </div>
        </div>

        {/* Pharmacy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => {
            const imgUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${pharmacy.imagePath}`;

            return (
              <div
                key={pharmacy.id}
                className="rounded-2xl bg-white shadow-md hover:shadow-lg transition p-4 border border-gray-200">
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
                  <MapPin size={16} className="text-red-400" />
                  {pharmacy.city} – {pharmacy.street}
                </p>

                {/* Working Hours */}
                <p className="flex items-center gap-1 text-gray-700 text-sm">
                  <Clock size={16} className="text-blue-500" />
                  Open: 8:00 AM – 12:00 AM
                </p>

                {/* Delivery */}
                <p className="flex items-center gap-1 text-gray-700 text-sm">
                  <Truck size={16} className="text-orange-500" />
                  Fast delivery available
                </p>
                <p className="text-gray-700 text-sm ml-6">
                  Delivery within 24 hours
                </p>

                {/* Button */}
                <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white w-full py-2 rounded-full font-medium">
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
