import { Pharmacy } from "@/types";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { PharmacyCard } from "@/Components/common";
import Link from "next/link";

export default async function TopRatedPharmacies() {
  let pharmacies: Pharmacy[] = [];
  let error: string | null = null;

  try {
    const data = await pharmacyService.getTopRatedPharmacies();
    pharmacies = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching top rated pharmacies:", err);
    error = "Failed to load pharmacies";
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-20 pb-10 px-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 md:mt-20 pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
            Top Pharmacies Near You
          </h3>
          <Link href="/user/search-medicine">
            <span className="text-sm text-primary hover:underline cursor-pointer">
              See All
            </span>
          </Link>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed ">
          Find trusted pharmacies that offer quick delivery and quality service.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.map((pharmacy) => (
          <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
        ))}
      </div>
    </div>
  );
}

