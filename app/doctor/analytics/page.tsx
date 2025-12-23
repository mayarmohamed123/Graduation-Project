import { Suspense } from "react";
import AnalyticsContent from "@/Components/features/doctor/analytics/AnalyticsContent";
import LoadingSpinner from "@/Components/common/LoadingSpinner";

export default function AnalyticsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500">Overview of your patient and appointment stats.</p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}