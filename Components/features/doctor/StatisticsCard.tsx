import React from 'react';

interface StatisticsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    iconBgColor: string;
}

export default function StatisticsCard({
    title,
    value,
    icon,
    iconBgColor,
    trend,
    trendDirection = 'up'
}: StatisticsCardProps & {
    trend?: string;
    trendDirection?: 'up' | 'down';
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                {/* Left side - Title and Value */}
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>

                    {/* Optional Trend Indicator */}
                    {trend && (
                        <p className={`text-sm font-medium mt-1 flex items-center ${trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            <span className="mr-1">
                                {trendDirection === 'up' ? '↗' : '↘'}
                            </span>
                            {trend}
                        </p>
                    )}
                </div>

                {/* Right side - Icon */}
                <div className={`${iconBgColor} p-3 rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
