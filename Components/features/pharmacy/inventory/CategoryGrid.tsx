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
  <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow cursor-default border border-gray-100 shadow-sm rounded-[2rem] bg-white">
    <div className="flex justify-between items-start">
      <p className="text-base font-medium text-gray-500">{title}</p>
      <div className="p-3 bg-[#EAFBF5] rounded-2xl">
        <CalendarDays className="w-6 h-6 text-[#2BBBC5]" />
      </div>
    </div>
    
    <div className="mt-2 space-y-2">
      <h3 className="text-3xl font-bold text-gray-900 leading-none">{value}</h3>
      <div className="flex items-center gap-2 pt-1">
        <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-500 bg-[#EAFBF5] px-2 py-1 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          {trend.startsWith("+") ? trend : `+${trend}`}
        </div>
        <p className="text-xs text-gray-400 font-medium whitespace-nowrap">Since last week</p>
      </div>
    </div>
  </Card>
);

export const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map((cat, i) => (
        <CategoryCard key={i} {...cat} />
      ))}
    </div>
  );
};
