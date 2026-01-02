import { PharmacistOrderStatus } from "@/types";

type OrderStatusFilter = "All" | PharmacistOrderStatus;

interface OrdersTabsProps {
    activeTab: OrderStatusFilter;
    onTabChange: (tab: OrderStatusFilter) => void;
}

export default function OrdersTabs({ activeTab, onTabChange }: OrdersTabsProps) {
    const tabs: OrderStatusFilter[] = ["All", "Confirmed", "Pending", "Delivered", "Cancelled"];

    return (
        <div className="flex gap-4 border-b border-gray-200">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === tab
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
