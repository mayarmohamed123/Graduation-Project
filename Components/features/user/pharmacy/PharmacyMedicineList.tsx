"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Medicine } from "@/types";
import MedicineCard from "@/Components/common/MedicineCard";

interface PharmacyMedicineListProps {
  medicines: Medicine[];
}

export default function PharmacyMedicineList({ medicines }: PharmacyMedicineListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Category");
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories = useMemo(() => ["Category", ...Array.from(new Set(medicines.map((m) => m.medicationCategory)))].filter(Boolean), [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch = 
        medicine.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "Category" || medicine.medicationCategory === selectedCategory;
      const matchesStock = !inStockOnly || medicine.quantity > 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [medicines, searchQuery, selectedCategory, inStockOnly]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Search and Filters Bar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search for medicine, vitamins, or equipment"
            className="w-full bg-white border border-gray-100 py-4 pl-14 pr-6 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select className="bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 relative" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}>
            <option>Price Range</option>
            <option>Under 100 EGP</option>
            <option>100 - 500 EGP</option>
            <option>Above 500 EGP</option>
          </select>


          <button 
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold transition-all ${inStockOnly ? 'bg-primary text-white shadow-primary/20' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'}`}
          >
            In Stock Only
          </button>
        </div>
      </div>

      {/* Medicine Grid */}
      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No medicines found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
        </div>
      )}

    
    </div>
  );
}
