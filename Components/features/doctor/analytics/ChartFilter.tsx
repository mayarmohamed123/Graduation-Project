"use client";

interface ChartFilterProps {
    year: number;
    month: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
}

export default function ChartFilter({ year, month, onYearChange, onMonthChange }: ChartFilterProps) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1.5">
            <select
                value={year}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-[10px] rounded-md focus:ring-primary focus:border-primary block p-1 outline-none transition-all hover:border-primary cursor-pointer"
            >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select
                value={month}
                onChange={(e) => onMonthChange(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-[10px] rounded-md focus:ring-primary focus:border-primary block p-1 outline-none transition-all hover:border-primary cursor-pointer"
            >
                {months.map(m => (
                    <option key={m} value={m}>
                        {new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                    </option>
                ))}
            </select>
        </div>
    );
}
