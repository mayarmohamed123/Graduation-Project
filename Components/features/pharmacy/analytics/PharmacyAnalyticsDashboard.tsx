"use client";

import { useState, useEffect } from "react";
import { Users, ShoppingBag, DollarSign, Package } from "lucide-react";
import { pharmacistService } from "@/Services/pharmacistService";
import { PharmacyDailyRevenue, SalesByCategory, OutOfStockData, InventoryReportData, PharmacyAnalyticsStats } from "@/types/pharmacist";
import { AreaChart, PieChart } from "@/Components/common/charts";
import SmartChartWrapper from "@/Components/common/analytics/SmartChartWrapper";
import StatisticsCard from "@/Components/features/doctor/StatisticsCard";

export default function PharmacyAnalyticsDashboard() {
    const [stats, setStats] = useState<PharmacyAnalyticsStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await pharmacistService.getAnalyticsStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch analytics stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatisticsCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue}`}
                        icon={<DollarSign className="w-6 h-6 text-green-600" />}
                        bgColor="bg-green-50"
                    />
                    <StatisticsCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    <StatisticsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={<Package className="w-6 h-6 text-amber-600" />}
                        bgColor="bg-amber-50"
                    />
                    <StatisticsCard
                        title="Total Customers"
                        value={stats.totalCustomers}
                        icon={<Users className="w-6 h-6 text-purple-600" />}
                        bgColor="bg-purple-50"
                    />
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmartChartWrapper fetchData={(y: number, m: number) => pharmacistService.getDailyRevenue(y, m)}>
                    {(data: PharmacyDailyRevenue[], loading: boolean, filters: React.ReactNode) => (
                        <AreaChart
                            data={data}
                            title="Daily Revenue"
                            subtitle="Pharmacy revenue per day"
                            dataKey="totalRevenue"
                            xAxisKey="date"
                            color="#2bbbc5"
                            gradientId="pharmacyRevenueGradient"
                            tooltipFormatter={(value) => [`$${value ?? 0}`, "Revenue"]}
                            headerAction={filters}
                        />
                    )}
                </SmartChartWrapper>

                <SmartChartWrapper fetchData={(y: number, m: number) => pharmacistService.getSalesByCategory(y, m)}>
                    {(data: SalesByCategory[], loading: boolean, filters: React.ReactNode) => (
                        <PieChart
                            data={data.filter(item => item.totalSales > 0)}
                            title="Sales by Category"
                            subtitle="Sales distribution by category"
                            dataKey="totalSales"
                            nameKey="category"
                            percentageKey="percentage"
                            legendPosition="right"
                            tooltipFormatter={(value) => [`$${value ?? 0}`, "Sales"]}
                        />
                    )}
                </SmartChartWrapper>
            </div>

            {/* Row 2: Inventory & Out of Stock Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SmartChartWrapper fetchData={() => pharmacistService.getOutOfStockLast30Days()}>
                    {(data: OutOfStockData[]) => (
                        <AreaChart
                            data={data}
                            title="Out of Stock Trends"
                            subtitle="Last 30 days"
                            dataKey="count"
                            xAxisKey="date"
                            color="#ef4444"
                            gradientId="outOfStockGradient"
                            tooltipFormatter={(value) => [`${value ?? 0}`, "Items"]}
                        />
                    )}
                </SmartChartWrapper>

                <SmartChartWrapper fetchData={() => pharmacistService.getInventoryReportLast30Days()}>
                    {(data: InventoryReportData[]) => (
                        <AreaChart
                            data={data}
                            title="Inventory Movement"
                            subtitle="Last 30 days"
                            dataKey="quantity"
                            xAxisKey="date"
                            color="#3b82f6"
                            gradientId="inventoryGradient"
                            tooltipFormatter={(value) => [`${value ?? 0}`, "Quantity"]}
                        />
                    )}
                </SmartChartWrapper>
            </div>
        </div>
    );
}
