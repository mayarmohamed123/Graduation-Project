"use client";

import { AdminPayment } from "@/types/admin";
import { PaymentRow } from "./PaymentRow";
import { CreditCard, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface PaymentsTableProps {
    payments: AdminPayment[];
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const matchesSearch =
                payment.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.payerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.referenceId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [payments, searchTerm, statusFilter]);

    const statuses = useMemo(() => {
        return ["all", ...new Set(payments.map(p => p.status.toLowerCase()))];
    }, [payments]);

    if (payments.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">There are no payment records in this category yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search & Filter Header */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payer, email or ref..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all capitalize"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="text-sm text-gray-500 font-medium">
                    Showing {filteredPayments.length} transactions
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payer Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Payment For</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount & Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Processed At</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Ref ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.map((payment) => (
                                <PaymentRow key={payment.id} payment={payment} />
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No results found for &quot;{searchTerm}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
