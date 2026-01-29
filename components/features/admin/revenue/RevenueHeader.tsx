import React from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

interface RevenueHeaderProps {
    totalRevenue: number;
    onRefresh: () => void;
    loading: boolean;
}

export const RevenueHeader: React.FC<RevenueHeaderProps> = ({ totalRevenue, onRefresh, loading }) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue & Payments</h1>
                    <p className="text-gray-500 mt-1">Track all financial transactions across the platform</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category Revenue</div>
                        <div className="text-xl font-bold text-gray-900">EGP {totalRevenue.toLocaleString()}</div>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm self-center"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Sync Records
                </button>
            </div>
        </div>
    );
};
