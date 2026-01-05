"use client";

import {
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface BarChartProps {
    data: object[];
    title: string;
    dataKey: string;
    xAxisKey: string;
    color?: string;
    height?: string;
    showGrid?: boolean;
    barRadius?: [number, number, number, number];
    headerAction?: React.ReactNode;
}

export default function BarChart({
    data,
    title,
    dataKey,
    xAxisKey,
    color = "#2DD4BF",
    height = "h-[300px]",
    showGrid = true,
    barRadius = [4, 4, 0, 0],
    headerAction,
}: BarChartProps) {
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
                    <RechartsBarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
                        <XAxis 
                            dataKey={xAxisKey} 
                            interval={0} 
                            tickLine={false} 
                            axisLine={false}
                            height={80}
                            tick={(props: { x: number; y: number; payload: { value: string } }) => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={0}
                                            dy={16}
                                            textAnchor="end"
                                            fill="#6b7280"
                                            transform="rotate(-45)"
                                            fontSize={10}
                                            className="font-medium"
                                        >
                                          {payload.value}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey={dataKey} fill={color} radius={barRadius} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
