"use client";

import { Calendar } from "lucide-react";

interface AnalyticsHeaderProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export const AnalyticsHeader = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: AnalyticsHeaderProps) => {
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500">Detailed overview of system performance and registrations.</p>
      </div>

      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border-r border-gray-100">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Filter Period</span>
        </div>
        
        <div className="flex items-center gap-2 px-1">
          <select 
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-primary transition-colors pr-1"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer hover:text-primary transition-colors"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
