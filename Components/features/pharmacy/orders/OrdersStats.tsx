import StatisticsCard from "@/Components/features/doctor/StatisticsCard";
import { Package, CheckCircle, Clock, Ban, Truck } from "lucide-react";

interface OrdersStatsProps {
    totalOrders: number;
    confirmedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    deliveredOrders: number;
}

export default function OrdersStats({
    totalOrders,
    confirmedOrders,
    pendingOrders,
    cancelledOrders,
    deliveredOrders,
}: OrdersStatsProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatisticsCard
                icon={<Package className="w-6 h-6 text-primary" />}
                title="Total Orders"
                value={totalOrders}
                bgColor="bg-white"
                trendDirection="up"
            />
            <StatisticsCard
                icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
                title="Completed Orders"
                value={confirmedOrders}
                bgColor="bg-white"
                trendDirection="up"
            />
            <StatisticsCard
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                title="Pending Orders"
                value={pendingOrders}
                bgColor="bg-white"
                trendDirection="up"
            />
            <StatisticsCard
                icon={<Ban className="w-6 h-6 text-red-600" />}
                title="Cancelled Orders"
                value={cancelledOrders}
                bgColor="bg-white"
                trendDirection="up"
            />
            <StatisticsCard
                icon={<Truck className="w-6 h-6 text-green-600" />}
                title="Delivered orders"
                value={deliveredOrders}
                bgColor="bg-white"
                trendDirection="up"
            />
        </div>
    );
}
