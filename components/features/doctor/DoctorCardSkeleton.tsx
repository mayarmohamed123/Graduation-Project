"use client";

export default function DoctorCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse">
            {/* Skeleton Image Area */}
            <div className="relative h-56 bg-gray-200"></div>

            {/* Content Section */}
            <div className="p-5 bg-gray-50 space-y-4">
                {/* Name and Specialty */}
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                </div>

                {/* Doctor Information */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                </div>
            </div>
        </div>
    );
}
