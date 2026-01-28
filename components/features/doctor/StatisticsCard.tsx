import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatisticsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    bgColor: string;
    trend?: string;
    trendDirection?: 'up' | 'down';
    compact?: boolean;
}

export default function StatisticsCard({
    title,
    value,
    icon,
    bgColor,
    trend,
    trendDirection = 'up',
    compact = false
}: StatisticsCardProps) {
    return (
        <div className={`${bgColor} rounded-2xl border border-gray-200 ${compact ? 'p-3' : 'p-6'} shadow-sm hover:shadow-md transition-all duration-300 group`}>
            <div className="flex items-start justify-between">
                {/* Left side - Title and Value */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className={`text-sm text-gray-500 font-semibold tracking-wide uppercase truncate`}>{title}</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <p className={`text-2xl font-bold text-gray-900`}>{value}</p>

                        {/* Beautiful Trend Indicator */}
                        {trend && (
                            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${trendDirection === 'up'
                                ? 'text-green-600 bg-green-100/50 border border-green-200'
                                : 'text-red-600 bg-red-100/50 border border-red-200'
                                }`}>
                                {trendDirection === 'up' ? (
                                    <TrendingUp className="h-2.5 w-2.5" />
                                ) : (
                                    <TrendingDown className="h-2.5 w-2.5" />
                                )}
                                {trend}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side - Icon */}
                <div className={`${compact ? 'p-2' : 'p-3'} bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300 shrink-0 ${compact ? 'ml-2' : 'ml-4'}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
