"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Brain,
    Lightbulb,
    SearchCheck,
    TrendingUp,
    Users,
} from "lucide-react";
import { PageContainer } from "@/components/biaslens/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import DashboardStatCard from "@/components/biaslens/DashboardStatCard";
import DashboardTrendChart from "@/components/biaslens/DashboardTrendChart";
import { dashboardMock } from "@/lib/mock-data";

function AmbientOrb({
    className,
    duration,
    x,
    y,
}: {
    className: string;
    duration: number;
    x: number[];
    y: number[];
}) {
    return (
        <motion.div
            className={className}
            animate={{ x, y }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            }}
        />
    );
}

export default function DashboardPage() {
    return (
        <PageContainer className="relative min-h-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(0,194,255,0.10),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(244,63,94,0.06),transparent_26%)]" />

                <AmbientOrb
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/16 blur-[120px]"
                    duration={16}
                    x={[0, 26, -10, 0]}
                    y={[0, 24, 8, 0]}
                />
                <AmbientOrb
                    className="absolute right-[-80px] top-1/4 h-80 w-80 rounded-full bg-secondary/12 blur-[120px]"
                    duration={18}
                    x={[0, -20, 12, 0]}
                    y={[0, -24, 10, 0]}
                />
            </div>

            <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <GlassCard className="relative overflow-hidden rounded-[30px] border border-violet-400/18 px-6 py-6 md:px-8 md:py-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/6" />

                            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                        Dashboard Overview
                                    </span>

                                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                                        Understand your reasoning patterns
                                    </h1>

                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                        Track recurring cognitive bias, review recent analyses, and
                                        see how your reasoning quality is improving over time.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                                        AI reasoning active
                                    </span>
                                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-200">
                                        Trend tracking enabled
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <DashboardStatCard
                            label={dashboardMock.stats[0].label}
                            value={dashboardMock.stats[0].value}
                            icon={<Activity className="h-5 w-5 text-violet-300" />}
                            accentClass="from-violet-500 to-indigo-500"
                            glowClass="shadow-[0_0_24px_rgba(139,92,246,0.10)]"
                        />
                        <DashboardStatCard
                            label={dashboardMock.stats[1].label}
                            value={dashboardMock.stats[1].value}
                            icon={<Brain className="h-5 w-5 text-cyan-300" />}
                            accentClass="from-cyan-400 to-blue-500"
                            glowClass="shadow-[0_0_24px_rgba(34,211,238,0.10)]"
                        />
                        <DashboardStatCard
                            label={dashboardMock.stats[2].label}
                            value={dashboardMock.stats[2].value}
                            icon={<Users className="h-5 w-5 text-amber-300" />}
                            accentClass="from-amber-400 to-orange-500"
                            glowClass="shadow-[0_0_24px_rgba(245,158,11,0.10)]"
                        />
                        <DashboardStatCard
                            label={dashboardMock.stats[3].label}
                            value={dashboardMock.stats[3].value}
                            icon={<TrendingUp className="h-5 w-5 text-rose-300" />}
                            accentClass="from-rose-500 to-pink-500"
                            glowClass="shadow-[0_0_24px_rgba(244,63,94,0.10)]"
                        />
                    </div>

                    {/* Trend + common biases */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.8fr]">
                        <DashboardTrendChart data={dashboardMock.trend} />

                        <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                            <div className="mb-5">
                                <h3 className="text-lg font-semibold text-white">
                                    Most Common Biases
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Patterns that appear most frequently across recent analyses.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {dashboardMock.commonBiases.map((item, index) => {
                                    const accent =
                                        index === 0
                                            ? "from-cyan-400 to-blue-500"
                                            : index === 1
                                                ? "from-violet-500 to-indigo-500"
                                                : index === 2
                                                    ? "from-rose-500 to-pink-500"
                                                    : "from-amber-400 to-orange-500";

                                    return (
                                        <motion.div
                                            key={item.name}
                                            whileHover={{ x: 2 }}
                                            className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <p className="text-sm font-medium text-white">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-slate-300">{item.value}%</p>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                                                    style={{ width: `${item.value}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Recent + insights */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                            <div className="mb-5 flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                                    <SearchCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Recent Analyses
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your latest reasoning prompts and thought patterns.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {dashboardMock.recent.map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06 }}
                                        className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
                                    >
                                        <p className="text-sm leading-6 text-slate-300">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                            <div className="mb-5 flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                                    <Lightbulb className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Insights</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        AI-generated takeaways from your recent decision patterns.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {dashboardMock.insights.map((item) => (
                                    <motion.div
                                        key={item}
                                        whileHover={{ y: -2 }}
                                        className="rounded-2xl border border-white/8 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5 px-4 py-4"
                                    >
                                        <div className="flex gap-3">
                                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                                            <p className="text-sm leading-6 text-slate-300">{item}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}