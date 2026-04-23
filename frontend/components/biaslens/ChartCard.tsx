"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";

type ChartDatum = {
    name: string;
    before: number;
    after: number;
};

export default function ChartCard({ data }: { data: ChartDatum[] }) {
    return (
        <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-white md:text-lg">Bias Reduction</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Compare the intensity of each bias before and after AI-guided refinement.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                        <span className="h-2 w-2 rounded-full bg-violet-400" />
                        Before
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        After
                    </span>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={12} barCategoryGap="22%">
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                            dataKey="name"
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
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            contentStyle={{
                                background: "rgba(15, 23, 42, 0.9)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "14px",
                                color: "#fff",
                                backdropFilter: "blur(14px)",
                            }}
                            labelStyle={{ color: "#E2E8F0" }}
                        />
                        <Bar
                            dataKey="before"
                            fill="#8B5CF6"
                            radius={[8, 8, 0, 0]}
                            animationDuration={900}
                        />
                        <Bar
                            dataKey="after"
                            fill="#22D3EE"
                            radius={[8, 8, 0, 0]}
                            animationDuration={1100}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}