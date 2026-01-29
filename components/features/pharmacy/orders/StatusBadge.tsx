import React from "react";

interface StatusBadgeProps {
    status: string;
    variant: "status" | "payment";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-blue-100 text-blue-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentColor = (status: string) => {
        return status === "Paid"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700";
    };

    const colorClasses = variant === "status" ? getStatusColor(status) : getPaymentColor(status);

    return (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>
            {status}
        </span>
    );
};
