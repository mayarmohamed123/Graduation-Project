"use client";

import { useEffect, useState } from "react";
import { doctorService } from "@/Services/doctorService";
import { appointmentService } from "@/Services/appointmentServices";
import AnalyticsDashboard from "@/Components/features/doctor/analytics/AnalyticsDashboard";
import { AppointmentStats } from "@/types/appointments";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import {
    AnalyticsAge,
    AnalyticsGender,
    AnalyticsStatus,
    AnalyticsPatientRetention,
} from "@/types/doctors";

interface AnalyticsData {
    genderData: AnalyticsGender;
    ageData: AnalyticsAge[];
    statusData: AnalyticsStatus[];
    retentionData: AnalyticsPatientRetention[];
    stats: AppointmentStats;
}

// This function fetches base analytics data (non-daily)
async function fetchAnalyticsData(): Promise<AnalyticsData> {
    const [
        genderData,
        ageData,
        statusData,
        retentionData,
        stats,
    ] = await Promise.all([
        doctorService.getAnalyticsGender(),
        doctorService.getAnalyticsAge(),
        doctorService.getAnalyticsStatus(),
        doctorService.getAnalyticsPatientRetention(),
        appointmentService.getAppointmentStats(),
    ]);

    return {
        genderData,
        ageData,
        statusData,
        retentionData,
        stats,
    };
}

// Hook that throws a promise for Suspense
function useAnalyticsData() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetchAnalyticsData()
            .then((result) => {
                if (isMounted) {
                    setData(result);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, error };
}

export default function AnalyticsContent() {
    const { data, error } = useAnalyticsData();

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
                <p className="font-medium">Failed to load analytics data</p>
                <p className="text-sm mt-1">{error.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {data ? (
                <AnalyticsDashboard
                    genderData={data.genderData}
                    ageData={data.ageData}
                    statusData={data.statusData}
                    retentionData={data.retentionData}
                    stats={data.stats}
                />
            ) : (
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
}
