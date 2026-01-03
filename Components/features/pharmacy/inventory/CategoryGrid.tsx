"use client";

import React from "react";
import { TrendingUp, CalendarDays } from "lucide-react";
import { Card } from "@/Components/ui/card";

interface CategoryStat {
  title: string;
  value: number;
  trend: string;
}

interface CategoryGridProps {
  categories: CategoryStat[];
}

const CategoryCard = ({ title, value, trend }: CategoryStat) => (
  <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow cursor-default border border-gray-100 shadow-sm rounded-[1.75rem] bg-white">
    <div className="flex justify-between items-start">
      <p className="text-sm font-semibold text-gray-500 font-outfit tracking-tight">{title}</p>
      <div className="p-2.5 bg-teal-50/50 rounded-xl">
        <CalendarDays className="w-5 h-5 text-[#2BBBC5]" />
      </div>
    </div>
    
    <div className="mt-2 space-y-1.5">
      <h3 className="text-2xl font-black text-gray-900 leading-none font-outfit">{value}</h3>
      <div className="flex items-center gap-2 pt-0.5">
        <div className="flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
          <TrendingUp className="w-3 h-3" />
          {trend.startsWith("+") ? trend : `+${trend}`}
        </div>
        <p className="text-[10px] text-gray-400 font-bold tracking-tighter whitespace-nowrap">Since last week</p>
      </div>
    </div>
  </Card>
);

export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {categories.map((cat, i) => (
        <CategoryCard key={i} {...cat} />
      ))}
    </div>
  );
};
