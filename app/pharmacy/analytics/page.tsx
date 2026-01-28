import { Suspense } from "react";
import PharmacyAnalyticsDashboard from "@/components/features/pharmacy/analytics/PharmacyAnalyticsDashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function PharmacyAnalyticsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">Overview of your pharmacy&apos;s financial performance.</p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <PharmacyAnalyticsDashboard />
      </Suspense>
    </div>
  );
}
