"use client";

import Image from "next/image";
import { AdminPayment } from "@/types/admin";
import {
    User,
    ShieldCheck,
    Clock,
    Phone,
    Mail,
    Receipt,
    Stethoscope,
    ShoppingCart,
    Building2,
} from "lucide-react";

interface PaymentRowProps {
    payment: AdminPayment;
}

export function PaymentRow({ payment }: PaymentRowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentForIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "order":
                return <ShoppingCart className="w-4 h-4" />;
            case "appointment":
                return <Stethoscope className="w-4 h-4" />;
            case "doctorregistration":
                return <ShieldCheck className="w-4 h-4" />;
            case "pharmacistregistration":
                return <Building2 className="w-4 h-4" />;
            default:
                return <Receipt className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "captured":
            case "paid":
            case "success":
                return "bg-green-100 text-green-800 border-green-200";
            case "pending":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "failed":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        {payment.payerImage ? (
                            <Image
                                src={payment.payerImage}
                                alt={payment.payerName}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{payment.payerName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span className="line-clamp-1">{payment.payerEmail}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium text-xs">
                    {getPaymentForIcon(payment.paymentFor)}
                    <span>{payment.paymentForName}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="space-y-1">
                    <div className="text-sm font-bold text-indigo-600">
                        EGP {payment.amount.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(payment.processedAt)}</span>
                    </div>
                    {payment.payerPhone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{payment.payerPhone}</span>
                        </div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="text-[10px] font-mono text-gray-400 select-all">
                    ID: {payment.referenceId.split('-')[0]}...
                </div>
            </td>
        </tr>
    );
}
