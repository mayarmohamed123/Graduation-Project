"use client";

import React from "react";
import { Search, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Medicine } from "@/types/medicine";

interface MedicineTableProps {
  medicines: Medicine[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicine: Medicine) => void;
}

export const MedicineTable = ({ 
  medicines, 
  searchQuery, 
  onSearchChange,
  onEdit,
  onDelete
}: MedicineTableProps) => {
  return (
    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold font-outfit">Product Catalog</CardTitle>
          <CardDescription className="text-muted-foreground text-xs font-medium tracking-widest">
            Complete management of your pharmaceutical inventory
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search by brand or generic name..." 
              className="pl-10 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all h-11 border-none shadow-none text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#E5E7EB]/50 text-[10px] tracking-[0.2em] font-black text-gray-500">
              <tr>
                <th className="pl-8 pr-4 py-5 font-bold">Product ID</th>
                <th className="px-4 py-5 font-bold">Product Name</th>
                <th className="px-4 py-5 font-bold">Quantity</th>
                <th className="px-4 py-5 font-bold">Price</th>
                <th className="px-4 py-5 font-bold">Status</th>
                <th className="pr-8 pl-4 py-5 text-center font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {medicines.map((medicine) => (
                <tr key={medicine.id} className="group hover:bg-gray-50/70 transition-all cursor-default relative overflow-hidden">
                  <td className="pl-8 pr-4 py-5">
                    <span className="font-mono text-xs font-bold text-gray-600">
                      #{medicine.id.toString().padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 p-1.5 flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                        <Image 
                          src={medicine.imagePath} 
                          alt={medicine.brandName} 
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors">{medicine.brandName}</p>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-tighter">
                          {medicine.genericName} {medicine.strength}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-800 text-sm">
                        {medicine.quantity} <span className="text-[10px] font-medium text-gray-400">Units</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5 font-bold text-gray-900 text-sm">
                    ${medicine.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-5">
                    {medicine.quantity === 0 ? (
                      <Badge variant="destructive" className="bg-red-50 text-red-500 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-tighter">
                        Out of Stock
                      </Badge>
                    ) : medicine.quantity < 5 ? (
                      <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-tighter">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none px-3 py-1 font-bold text-[9px] uppercase tracking-tighter">
                        In Stock
                      </Badge>
                    )}
                  </td>
                  <td className="pr-8 pl-4 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onDelete?.(medicine)}
                        className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-500 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit?.(medicine)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all active:scale-90"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
