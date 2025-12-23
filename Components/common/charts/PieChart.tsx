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

interface PieChartDataItem {
    name: string;
    value: number;
    color: string;
    [key: string]: unknown;
}

interface PieChartProps {
    data: PieChartDataItem[];
    title: string;
    height?: string;
    innerRadius?: number;
    outerRadius?: number;
    paddingAngle?: number;
    showLegend?: boolean;
}

export default function PieChart({
    data,
    title,
    height = "h-[300px]",
    innerRadius = 60,
    outerRadius = 80,
    paddingAngle = 5,
    showLegend = true,
}: PieChartProps) {
    return (
        <Card className="shadow-sm border-none">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className={height}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill="#8884d8"
                            paddingAngle={paddingAngle}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        {showLegend && <Legend verticalAlign="bottom" height={36} />}
                    </RechartsPieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
