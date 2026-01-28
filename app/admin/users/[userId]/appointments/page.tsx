"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DoctorAppointment } from "@/types/appointments";
import { adminService } from "@/Services/admin/adminService";
import { UserAppointmentsTable } from "@/components/features/admin/users/UserAppointmentsTable";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ArrowLeft, RefreshCw, AlertCircle, CalendarRange } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UserAppointmentsPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string;

    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointments = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const data = await adminService.getUserAppointments(userId);
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load medical history");
            toast.error("Failed to load user appointments");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all active:scale-95 "
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <CalendarRange className="w-6 h-6 text-purple-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Medical Bookings</h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Viewing appointment history for selected user</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchAppointments()}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Bookings
                </button>
            </div>

            {loading && appointments.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center gap-4">
                    <LoadingSpinner />
                    <p className="text-gray-500 animate-pulse font-medium text-sm">Fetching medical records...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Could not load bookings</h3>
                    <p className="text-gray-500 max-w-md mb-8">{error}</p>
                    <button
                        onClick={() => fetchAppointments()}
                        className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/25 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <UserAppointmentsTable appointments={appointments} />
            )}
        </div>
    );
}
