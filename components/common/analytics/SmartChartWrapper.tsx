"use client";

import { useState, useEffect, useCallback } from "react";
import ChartFilter from "./ChartFilter";

interface SmartChartWrapperProps<T> {
    fetchData?: (year: number, month: number) => Promise<T[]>;
    children: (data: T[], isLoading: boolean, filterUI: React.ReactNode) => React.ReactNode;
    initialData?: T[];
}

export default function SmartChartWrapper<T>({
    fetchData,
    children,
    initialData = [],
}: SmartChartWrapperProps<T>) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [data, setData] = useState<T[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        if (!fetchData) return;
        setIsLoading(true);
        try {
            const result = await fetchData(selectedYear, selectedMonth);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch chart data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedYear, selectedMonth, fetchData]);

    useEffect(() => {
        if (fetchData) {
            loadData();
        }
    }, [loadData, fetchData]);

    const filterUI = (
        <div className="flex items-center gap-2">
            <ChartFilter
                year={selectedYear}
                month={selectedMonth}
                onYearChange={setSelectedYear}
                onMonthChange={setSelectedMonth}
            />
            {isLoading && (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
            )}
        </div>
    );

    return <>{children(data, isLoading, filterUI)}</>;
}
