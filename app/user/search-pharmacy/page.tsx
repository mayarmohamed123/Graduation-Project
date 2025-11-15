import { SearchInput } from "@/Components";
import PrvButton from "@/Components/shared/prvButton";
import { Pharmacy } from "@/types";
import Image from "next/image";

async function getPharmacies(): Promise<Pharmacy[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Pharmacy`, {
    next: { revalidate: 60 }, // ISR caching every 60 seconds
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
        <div className="mb-8 flex">
          <div className="flex justify-between">
            <PrvButton />
            <h3 className="text-4xl font-semibold text-gray-900">Pharmacy</h3>
          </div>
          {/* Search Input */}
          <SearchInput />
        </div>

        {/* Pharmacy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => {
            const imgUrl = `${process.env.NEXT_PUBLIC_API_IMAGE_BASE_URL}${pharmacy.imagePath}`;
            return (
              <div
                key={pharmacy.id}
                className="rounded-xl bg-white shadow p-4 border border-gray-200">
                <div className="h-48 w-full rounded overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={pharmacy.name}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="text-xl font-semibold">{pharmacy.name}</h3>
                  <p className="text-gray-700 text-sm">📍 {pharmacy.city}</p>
                  <p className="text-gray-700 text-sm">📞 {pharmacy.phone}</p>

                  <p className="text-yellow-500">
                    {pharmacy.rating !== null
                      ? `⭐ ${pharmacy.rating.toFixed(1)}`
                      : "⭐ No ratings yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
