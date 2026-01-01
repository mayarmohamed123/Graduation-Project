"use client";

import {
    Area,
    AreaChart as RechartsAreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface AreaChartProps {
    data: object[];
    title: string;
    subtitle?: string;
    dataKey: string;
    xAxisKey: string;
    color?: string;
    gradientId?: string;
    showIcon?: boolean;
    hideXAxis?: boolean;
    hideYAxis?: boolean;
    height?: string;
    tooltipFormatter?: (value: number | undefined) => [string, string];
    xAxisFormatter?: (value: string | number) => string;
    headerAction?: React.ReactNode;
}

export default function AreaChart({
    data,
    title,
    subtitle,
    dataKey,
    xAxisKey,
    color = "#2bbbc5",
    gradientId = "areaGradient",
    showIcon = true,
    hideXAxis = false,
    hideYAxis = false,
    height = "h-[300px]",
    tooltipFormatter,
    xAxisFormatter,
    headerAction,
}: AreaChartProps) {
    const defaultXAxisFormatter = (value: string | number) => {
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return value.split('-')[2]; // Return only the day
        }
        return String(value);
    };

    const formatter = xAxisFormatter || defaultXAxisFormatter;

    return (
        <Card className="shadow-sm border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        {headerAction}
                    </div>
                </div>
            </CardHeader>
            <CardContent className={height}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={data} margin={{ right: 30 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey={xAxisKey}
                            hide={hideXAxis}
                            tickFormatter={formatter}
                            tick={{ fontSize: 10 }}
                            interval="preserveStartEnd"
                        />
                        {!hideYAxis && <YAxis />}
                        <Tooltip formatter={tooltipFormatter} />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                        />
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
