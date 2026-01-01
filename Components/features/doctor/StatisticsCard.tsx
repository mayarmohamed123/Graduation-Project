import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatisticsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
}

export default function StatisticsCard({
    title,
    value,
    icon,
    bgColor,
    trend,
    trendDirection = 'up'
}: StatisticsCardProps) {
    return (
        <div className={`${bgColor} rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}>
            <div className="flex items-start justify-between">
                {/* Left side - Title and Value */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{title}</p>
                    <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-bold text-gray-900">{value}</p>

                        {/* Beautiful Trend Indicator */}
                        {trend && (
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${trendDirection === 'up'
                                ? 'text-green-600 bg-green-100/50 border border-green-200'
                                : 'text-red-600 bg-red-100/50 border border-red-200'
                                }`}>
                                {trendDirection === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {trend}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side - Icon */}
                <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            </div>
        </div>
    );
}
