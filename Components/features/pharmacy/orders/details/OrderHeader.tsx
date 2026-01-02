import { ArrowLeft, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
    orderNumber: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
}

export default function OrderHeader({
    orderNumber,
    status,
    paymentStatus,
    createdAt,
}: OrderHeaderProps) {
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Delivered":
                return "bg-blue-100 text-blue-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPaymentStatusIcon = (status: string) => {
        if (status === "Paid") return "💳";
        if (status === "Refunded") return "💰";
        return "⏳";
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Go Back"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">Order #{orderNumber}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>📅 {new Date(createdAt).toLocaleString()}</span>
                        <span>
                            {getPaymentStatusIcon(paymentStatus)} {paymentStatus}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
