"use client";

import {
    Line,
    LineChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";

type TrendDatum = {
    month: string;
    confirmation: number;
    herd: number;
    anchoring: number;
    overgeneralization: number;
};

export default function DashboardTrendChart({
    data,
}: {
    data: TrendDatum[];
}) {
    return (
        <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Bias Trend</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        How your major cognitive patterns evolve over time.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                        <span className="h-2 w-2 rounded-full bg-violet-400" />
                        Confirmation
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        Herd
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        Anchoring
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-200">
                        <span className="h-2 w-2 rounded-full bg-rose-400" />
                        Overgeneralization
                    </span>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#94A3B8", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: "rgba(15, 23, 42, 0.9)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "14px",
                                color: "#fff",
                                backdropFilter: "blur(14px)",
                            }}
                            labelStyle={{ color: "#E2E8F0" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="confirmation"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="herd"
                            stroke="#22D3EE"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="anchoring"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="overgeneralization"
                            stroke="#F43F5E"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}