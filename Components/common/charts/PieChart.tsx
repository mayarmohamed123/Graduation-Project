"use client";

import {
    Cell,
    Legend,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface PieChartProps {
    data: Record<string, unknown>[];
    title: string;
    subtitle?: string;
    height?: string;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    showLegend?: boolean;
    headerAction?: React.ReactNode;
    nameKey?: string;
    dataKey?: string;
    percentageKey?: string;
    colors?: string[];
    tooltipFormatter?: (value: number | undefined) => [string, string];
    legendPosition?: "bottom" | "right";
}

interface LegendPayloadEntry {
    value?: string;
    color?: string;
    payload?: unknown;
}

const DEFAULT_COLORS = ["#2bbbc5", "#3b82f6", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

export default function PieChart({
    data,
    title,
    subtitle,
    height = "h-[300px]",
    innerRadius = 60,
    outerRadius = 80,
    paddingAngle = 5,
    showLegend = true,
    headerAction,
    nameKey = "name",
    dataKey = "value",
    percentageKey,
    colors = DEFAULT_COLORS,
    tooltipFormatter,
    legendPosition = "bottom",
}: PieChartProps) {
    const renderCustomLegend = (props: unknown) => {
        const { payload } = props as { payload?: readonly LegendPayloadEntry[] };
        if (!payload) return null;

        return (
            <ul className={`flex ${legendPosition === "right" ? "flex-col justify-center h-full gap-4 ml-4" : "flex-row justify-center gap-6 mt-4"} text-sm`}>
                {payload.map((entry: LegendPayloadEntry, index: number) => {
                    const dataItem = data[index];
                    const percentageValue = percentageKey && dataItem ? dataItem[percentageKey] : null;

                    return (
                        <li key={`item-${index}`} className="flex items-center justify-between min-w-[150px]">
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-gray-600 capitalize">{entry.value}</span>
                            </div>
                            {percentageValue !== null && (
                                <span className="text-gray-900 font-medium ml-4">
                                    {typeof percentageValue === 'number' ? `${percentageValue.toFixed(1)}%` : percentageValue as string}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <Card className="shadow-sm border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {headerAction}
                </div>
            </CardHeader>
            <CardContent className={height}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx={legendPosition === "right" ? "40%" : "50%"}
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            paddingAngle={paddingAngle}
                            dataKey={dataKey}
                            nameKey={nameKey}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={(entry.color as string) || colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={tooltipFormatter} />
                        {showLegend && (
                            <Legend
                                content={renderCustomLegend as (props: any) => React.ReactNode}
                                verticalAlign={legendPosition === "right" ? "middle" : "bottom"}
                                align={legendPosition === "right" ? "right" : "center"}
                                layout={legendPosition === "right" ? "vertical" : "horizontal"}
                            />
                        )}
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
