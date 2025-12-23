"use client";

import { useEffect, useState } from "react";
import { doctorService } from "@/Services/doctorService";
import AnalyticsDashboard from "@/Components/features/doctor/analytics/AnalyticsDashboard";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import {
    AnalyticsAge,
    AnalyticsAppointments,
    AnalyticsGender,
    AnalyticsRevenue,
    AnalyticsStatus,
    AnalyticsPatientRetention,
} from "@/types/doctors";

interface AnalyticsData {
    appointmentsData: AnalyticsAppointments[];
    revenueData: AnalyticsRevenue[];
    genderData: AnalyticsGender;
    ageData: AnalyticsAge[];
    statusData: AnalyticsStatus[];
    retentionData: AnalyticsPatientRetention[];
}

// This function fetches all analytics data
async function fetchAnalyticsData(): Promise<AnalyticsData> {
    const [
        appointmentsData,
        revenueData,
        genderData,
        ageData,
        statusData,
        retentionData,
    ] = await Promise.all([
        doctorService.getAnalyticsAppointments(),
        doctorService.getAnalyticsRevenue(),
        doctorService.getAnalyticsGender(),
        doctorService.getAnalyticsAge(),
        doctorService.getAnalyticsStatus(),
        doctorService.getAnalyticsPatientRetention(),
    ]);

    return {
        appointmentsData,
        revenueData,
        genderData,
        ageData,
        statusData,
        retentionData,
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

    return { data, error, isLoading };
}

export default function AnalyticsContent() {
    const { data, error, isLoading } = useAnalyticsData();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load analytics data. Please try again later.
            </div>
        );
    }

    if (!data) return null;

    return (
        <AnalyticsDashboard
            appointmentsData={data.appointmentsData}
            revenueData={data.revenueData}
            genderData={data.genderData}
            ageData={data.ageData}
            statusData={data.statusData}
            retentionData={data.retentionData}
        />
    );
}
