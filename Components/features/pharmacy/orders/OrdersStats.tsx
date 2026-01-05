import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import { Package, CheckCircle, Clock, Ban, Truck, DollarSign } from "lucide-react";
import { OrdersDashboardResponse } from "@/types";

interface OrdersStatsProps {
    stats: OrdersDashboardResponse;
}

export default function OrdersStats({ stats }: OrdersStatsProps) {
    const { thisWeek, lastWeek } = stats;

    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return { value: current > 0 ? "100%" : "0%", direction: "up" as const };
        const percentage = ((current - previous) / previous) * 100;
        return {
            value: `${Math.abs(percentage).toFixed(1)}%`,
            direction: percentage >= 0 ? "up" as const : "down" as const
        };
    };

    const totalOrdersTrend = calculateTrend(thisWeek.totalOrders, lastWeek.totalOrders);
    const confirmedTrend = calculateTrend(thisWeek.confirmedOrders, lastWeek.confirmedOrders);
    const pendingTrend = calculateTrend(thisWeek.pendingOrders, lastWeek.pendingOrders);
    const cancelledTrend = calculateTrend(thisWeek.cancelledOrders, lastWeek.cancelledOrders);
    const deliveredTrend = calculateTrend(thisWeek.delieveredOrders, lastWeek.delieveredOrders);
    const revenueTrend = calculateTrend(thisWeek.totalRevenue, lastWeek.totalRevenue);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatisticsCard
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                title="Total Revenue"
                value={`$${thisWeek.totalRevenue}`}
                bgColor="bg-green-50"
                trend={revenueTrend.value}
                trendDirection={revenueTrend.direction}
                compact={true}
            />
            <StatisticsCard
                icon={<Package className="w-5 h-5 text-blue-600" />}
                title="Total Orders"
                value={thisWeek.totalOrders}
                bgColor="bg-blue-50"
                trend={totalOrdersTrend.value}
                trendDirection={totalOrdersTrend.direction}
                compact={true}
            />
            <StatisticsCard
                icon={<CheckCircle className="w-5 h-5 text-indigo-600" />}
                title="Completed"
                value={thisWeek.confirmedOrders}
                bgColor="bg-indigo-50"
                trend={confirmedTrend.value}
                trendDirection={confirmedTrend.direction}
                compact={true}
            />
            <StatisticsCard
                icon={<Clock className="w-5 h-5 text-amber-600" />}
                title="Pending"
                value={thisWeek.pendingOrders}
                bgColor="bg-amber-50"
                trend={pendingTrend.value}
                trendDirection={pendingTrend.direction}
                compact={true}
            />
            <StatisticsCard
                icon={<Ban className="w-5 h-5 text-red-600" />}
                title="Cancelled"
                value={thisWeek.cancelledOrders}
                bgColor="bg-red-50"
                trend={cancelledTrend.value}
                trendDirection={cancelledTrend.direction}
                compact={true}
            />
            <StatisticsCard
                icon={<Truck className="w-5 h-5 text-teal-600" />}
                title="Delivered"
                value={thisWeek.delieveredOrders}
                bgColor="bg-teal-50"
                trend={deliveredTrend.value}
                trendDirection={deliveredTrend.direction}
                compact={true}
            />
        </div>
    );
}
