"use client";

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface LineConfig {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dotRadius?: number;
}

interface LineChartProps {
    data: object[];
    title: string;
    lines: LineConfig[];
    xAxisKey: string;
    height?: string;
    showGrid?: boolean;
    showLegend?: boolean;
    headerAction?: React.ReactNode;
}

export default function LineChart({
    data,
    title,
    lines,
    xAxisKey,
    height = "h-[400px]",
    showGrid = true,
    showLegend = true,
    headerAction,
}: LineChartProps) {
    return (
        <Card className="shadow-sm border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {headerAction}
                </div>
            </CardHeader>
            <CardContent className={height}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
                        <XAxis dataKey={xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        {showLegend && <Legend />}
                        {lines.map((line) => (
                            <Line
                                key={line.dataKey}
                                type="monotone"
                                dataKey={line.dataKey}
                                name={line.name}
                                stroke={line.color}
                                strokeWidth={line.strokeWidth || 2}
                                dot={{ r: line.dotRadius || 4 }}
                            />
                        ))}
                    </RechartsLineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
