import { Pharmacy } from "@/types";
import { PharmacyCard } from "@/components/common";
import Link from "next/link";

interface TopRatedPharmaciesProps {
  pharmacies: Pharmacy[];
}

export default function TopRatedPharmacies({ pharmacies }: TopRatedPharmaciesProps) {
  if (pharmacies.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 md:mt-20 pb-10 px-4 md:px-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-2">
            Top Pharmacies Near You
          </h3>
          <Link href="/user/search-pharmacy">
            <button className="px-5 py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all duration-300 border border-primary/20 flex items-center gap-2">
              Search Pharmacy
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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

