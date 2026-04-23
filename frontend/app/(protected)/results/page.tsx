"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Brain,
    CheckCircle2,
    AlertTriangle,
    Flag,
    ShieldAlert,
    BarChart3,
    Scale,
    Sparkles,
    Target,
    Copy,
    RotateCw,
    Eye,
    Users,
    Anchor,
    GitBranch,
    Quote,
} from "lucide-react";

import { PageContainer } from "@/components/biaslens/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import ChartCard from "@/components/biaslens/ChartCard";

interface BiasResult {
    originalThought: string;
    biases: { name: string; score: number; color: string }[];
    arguments: {
        facts: string[];
        assumptions: string[];
        conclusion: string;
    };
    firewall: {
        devil: string[];
        statistician: string[];
        judge: string[];
    };
    improvedThought: string;
    improvement: { name: string; before: number; after: number }[];
}

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

function SectionHeader({
    icon,
    title,
    subtitle,
    iconClassName = "text-primary",
    chipClassName = "bg-white/5 border-white/10",
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    iconClassName?: string;
    chipClassName?: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-xl ${chipClassName} ${iconClassName}`}
            >
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    );
}

const biasMeta = {
    "Confirmation Bias": {
        icon: Eye,
        gradient: "from-violet-500 to-indigo-500",
        iconBg: "bg-violet-500/12",
        iconBorder: "border-violet-400/20",
        iconText: "text-violet-300",
        glow: "shadow-[0_0_30px_rgba(139,92,246,0.22)]",
        border: "border-violet-400/18",
        tint: "from-violet-500/12 via-violet-400/4 to-transparent",
        progress: "#8B5CF6",
    },
    "Herd Bias": {
        icon: Users,
        gradient: "from-cyan-400 to-blue-500",
        iconBg: "bg-cyan-500/12",
        iconBorder: "border-cyan-400/20",
        iconText: "text-cyan-300",
        glow: "shadow-[0_0_30px_rgba(34,211,238,0.22)]",
        border: "border-cyan-400/18",
        tint: "from-cyan-500/12 via-cyan-400/4 to-transparent",
        progress: "#22D3EE",
    },
    "Anchoring Bias": {
        icon: Anchor,
        gradient: "from-amber-400 to-orange-500",
        iconBg: "bg-amber-500/12",
        iconBorder: "border-amber-400/20",
        iconText: "text-amber-300",
        glow: "shadow-[0_0_30px_rgba(251,191,36,0.22)]",
        border: "border-amber-400/18",
        tint: "from-amber-500/12 via-amber-400/4 to-transparent",
        progress: "#F59E0B",
    },
    "Overgeneralization Bias": {
        icon: GitBranch,
        gradient: "from-rose-500 to-pink-500",
        iconBg: "bg-rose-500/12",
        iconBorder: "border-rose-400/20",
        iconText: "text-rose-300",
        glow: "shadow-[0_0_30px_rgba(244,63,94,0.22)]",
        border: "border-rose-400/18",
        tint: "from-rose-500/12 via-rose-400/4 to-transparent",
        progress: "#F43F5E",
    },
};

function BiasMiniCard({
    name,
    score,
    highlighted,
}: {
    name: string;
    score: number;
    highlighted?: boolean;
}) {
    const meta = biasMeta[name as keyof typeof biasMeta];
    const Icon = meta.icon;
    const intensity =
        score >= 75 ? "High intensity" : score >= 50 ? "Moderate pattern" : "Watch closely";

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.22 }}
            className="h-full"
        >
            <GlassCard
                className={[
                    "relative h-full overflow-hidden rounded-[26px] p-5",
                    meta.glow,
                    meta.border,
                    highlighted ? "ring-1 ring-white/10" : "",
                ].join(" ")}
            >
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${meta.tint} opacity-80`}
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${meta.iconBg} ${meta.iconBorder} ${meta.iconText}`}
                        >
                            <Icon className="h-5 w-5" />
                        </div>

                        {highlighted ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
                                Highest
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-white md:text-base">{name}</h3>
                        <div className="mt-2 flex items-end justify-between gap-3">
                            <p className="text-3xl font-bold tracking-tight text-white">{score}%</p>

                            <div className="relative flex h-16 w-16 items-center justify-center">
                                <svg className="h-16 w-16 -rotate-90">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r={radius}
                                        stroke="rgba(255,255,255,0.08)"
                                        strokeWidth="6"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r={radius}
                                        stroke={meta.progress}
                                        strokeWidth="6"
                                        strokeLinecap="round"
                                        fill="transparent"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                    />
                                </svg>
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">{intensity}</p>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function ReasoningColumn({
    title,
    icon,
    items,
    accent,
    description,
}: {
    title: string;
    icon: React.ReactNode;
    items?: string[];
    accent: string;
    description?: string;
}) {
    return (
        <div className="relative">
            <div className="mb-4 flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${accent}`}
                >
                    {icon}
                </div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
            </div>

            <div className="h-px w-full bg-white/8" />

            {items ? (
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                    {items.map((item) => (
                        <li key={item} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm leading-6 text-slate-300">{description}</p>
            )}
        </div>
    );
}

function FirewallCard({
    title,
    subtitle,
    icon,
    points,
    className,
    iconClassName,
    dotClassName,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    points: string[];
    className: string;
    iconClassName: string;
    dotClassName: string;
}) {
    return (
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
            <GlassCard className={`relative h-full rounded-[26px] p-6 ${className}`}>
                <div className="relative z-10">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <div
                                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border ${iconClassName}`}
                            >
                                {icon}
                            </div>
                            <h3 className="text-base font-semibold text-white">{title}</h3>
                            <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                AI Persona
                            </span>
                        </div>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>

                    <ul className="space-y-3 text-sm leading-6 text-slate-300">
                        {points.slice(0, 4).map((point) => (
                            <li key={point} className="flex gap-3">
                                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClassName}`} />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </GlassCard>
        </motion.div>
    );
}

function ConfidenceRing({ value }: { value: number }) {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90">
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    fill="transparent"
                />
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="url(#confidenceGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
                <defs>
                    <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute text-center">
                <p className="text-lg font-bold text-white">{value}%</p>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    const router = useRouter();

    const [resultData, setResultData] = useState<BiasResult | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem("biaslens_result");
            if (stored) {
                try {
                    setResultData(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse result", e);
                    router.push("/analyze");
                }
            } else {
                router.push("/analyze");
            }
        }
    }, [router]);

    const originalThought = useMemo(() => {
        if (!resultData) return "";
        if (typeof window === "undefined") return resultData.originalThought;
        return sessionStorage.getItem("biaslens_thought") || resultData.originalThought;
    }, [resultData]);

    if (!isMounted || !resultData) return null;

    const handleCopy = async () => {
        const text = `Original Thought:\n${originalThought}\n\nImproved Thought:\n${resultData.improvedThought}`;
        await navigator.clipboard.writeText(text);
    };

    const highestBias = [...resultData.biases].sort((a, b) => b.score - a.score)[0];
    const largestDrop = [...resultData.improvement].sort(
        (a, b) => b.before - b.after - (a.before - a.after)
    )[0];
    const avgReduction = Math.round(
        resultData.improvement.reduce((acc, item) => acc + (item.before - item.after), 0) /
        resultData.improvement.length
    );

    return (
        <PageContainer className="min-h-screen overflow-hidden py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(0,194,255,0.12),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(59,130,246,0.08),transparent_28%)]" />

                <AmbientOrb
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/18 blur-[120px]"
                    duration={16}
                    x={[0, 26, -10, 0]}
                    y={[0, 24, 8, 0]}
                />
                <AmbientOrb
                    className="absolute right-[-80px] top-1/4 h-80 w-80 rounded-full bg-secondary/16 blur-[120px]"
                    duration={18}
                    x={[0, -20, 12, 0]}
                    y={[0, -24, 10, 0]}
                />
                <AmbientOrb
                    className="absolute bottom-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]"
                    duration={20}
                    x={[0, 18, -18, 0]}
                    y={[0, -18, 8, 0]}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl space-y-9">
                {/* Section 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <GlassCard className="relative overflow-hidden rounded-[30px] border border-violet-400/20 px-6 py-6 md:px-8 md:py-8 shadow-[0_0_40px_rgba(139,92,246,0.08)]">
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 via-fuchsia-400 to-cyan-400" />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5" />

                        <div className="relative z-10">
                            <SectionHeader
                                icon={<Quote className="h-5 w-5" />}
                                title="Original Thought"
                                subtitle="Input received"
                                iconClassName="text-violet-300"
                                chipClassName="bg-violet-500/10 border-violet-400/20"
                            />

                            <div className="mt-5">
                                <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    User statement
                                </span>
                            </div>

                            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200 md:text-2xl md:leading-10">
                                {originalThought}
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Section 2 */}
                <section className="space-y-5">
                    <SectionHeader
                        icon={<Brain className="h-5 w-5" />}
                        title="Detected Biases"
                        subtitle="Multiple cognitive patterns found in the reasoning"
                        iconClassName="text-cyan-300"
                        chipClassName="bg-cyan-500/10 border-cyan-400/20"
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {resultData.biases.map((bias, index) => (
                            <motion.div
                                key={bias.name}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.08 }}
                            >
                                <BiasMiniCard
                                    name={bias.name}
                                    score={bias.score}
                                    highlighted={highestBias && bias.name === highestBias.name}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 3 */}
                <section className="space-y-5">
                    <SectionHeader
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        title="Reasoning Breakdown"
                        subtitle="How the thought was interpreted by the system"
                        iconClassName="text-emerald-300"
                        chipClassName="bg-emerald-500/10 border-emerald-400/20"
                    />

                    <GlassCard className="rounded-[30px] px-6 py-6 md:px-8 md:py-8">
                        <div className="grid gap-8 md:grid-cols-3 md:divide-x md:divide-white/8">
                            <div className="md:pr-6">
                                <ReasoningColumn
                                    title="Facts"
                                    icon={<CheckCircle2 className="h-5 w-5 text-cyan-300" />}
                                    items={resultData.arguments.facts}
                                    accent="border-cyan-400/20 bg-cyan-500/10 text-cyan-300"
                                />
                            </div>

                            <div className="md:px-6">
                                <ReasoningColumn
                                    title="Assumptions"
                                    icon={<AlertTriangle className="h-5 w-5 text-amber-300" />}
                                    items={resultData.arguments.assumptions}
                                    accent="border-amber-400/20 bg-amber-500/10 text-amber-300"
                                />
                            </div>

                            <div className="md:pl-6">
                                <ReasoningColumn
                                    title="Conclusion"
                                    icon={<Flag className="h-5 w-5 text-violet-300" />}
                                    description={resultData.arguments.conclusion}
                                    accent="border-violet-400/20 bg-violet-500/10 text-violet-300"
                                />
                            </div>
                        </div>
                    </GlassCard>
                </section>

                {/* Section 4 */}
                <section className="space-y-5">
                    <SectionHeader
                        icon={<ShieldAlert className="h-5 w-5" />}
                        title="Cognitive Firewall"
                        subtitle="AI personas challenge your reasoning from multiple perspectives"
                        iconClassName="text-orange-300"
                        chipClassName="bg-orange-500/10 border-orange-400/20"
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <FirewallCard
                            title="Devil’s Advocate"
                            subtitle="Questions your certainty and challenges weak assumptions."
                            icon={<ShieldAlert className="h-5 w-5 text-orange-300" />}
                            points={resultData.firewall.devil}
                            className="border-orange-400/18 bg-gradient-to-br from-orange-500/8 via-transparent to-red-500/5 shadow-[0_0_30px_rgba(249,115,22,0.12)]"
                            iconClassName="border-orange-400/20 bg-orange-500/10"
                            dotClassName="bg-orange-400"
                        />

                        <FirewallCard
                            title="Statistician"
                            subtitle="Looks for evidence, probability, and measurable patterns."
                            icon={<BarChart3 className="h-5 w-5 text-cyan-300" />}
                            points={resultData.firewall.statistician}
                            className="border-cyan-400/18 bg-gradient-to-br from-cyan-500/8 via-transparent to-blue-500/5 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                            iconClassName="border-cyan-400/20 bg-cyan-500/10"
                            dotClassName="bg-cyan-400"
                        />

                        <FirewallCard
                            title="Judge"
                            subtitle="Balances perspectives and moves toward a fair conclusion."
                            icon={<Scale className="h-5 w-5 text-violet-300" />}
                            points={resultData.firewall.judge}
                            className="border-violet-400/18 bg-gradient-to-br from-violet-500/8 via-transparent to-fuchsia-500/5 shadow-[0_0_30px_rgba(139,92,246,0.12)]"
                            iconClassName="border-violet-400/20 bg-violet-500/10"
                            dotClassName="bg-violet-400"
                        />
                    </div>
                </section>

                {/* Section 5 */}
                <section className="space-y-5">
                    <SectionHeader
                        icon={<Sparkles className="h-5 w-5" />}
                        title="Improved Thought"
                        subtitle="A more balanced version of your reasoning"
                        iconClassName="text-fuchsia-300"
                        chipClassName="bg-fuchsia-500/10 border-fuchsia-400/20"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 -z-10 rounded-[32px] bg-fuchsia-500/10 blur-3xl" />

                        <GlassCard className="rounded-[30px] border border-violet-400/18 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/6 px-6 py-6 shadow-[0_0_40px_rgba(139,92,246,0.08)] md:px-8 md:py-8">
                            <div className="grid gap-8 md:grid-cols-[1fr_180px] md:items-start">
                                <div>
                                    <p className="text-lg leading-8 text-slate-100 md:text-xl md:leading-9">
                                        {resultData.improvedThought}
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            onClick={handleCopy}
                                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 shadow-[0_10px_25px_rgba(108,99,255,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(108,99,255,0.3)]"
                                        >
                                            <Copy className="h-4 w-4" />
                                            Copy
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            onClick={() => router.push("/analyze")}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1]"
                                        >
                                            <RotateCw className="h-4 w-4" />
                                            Re-analyze
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] px-5 py-5 shadow-inner shadow-white/[0.02]">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-300">
                                            <Target className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                                Confidence
                                            </p>
                                            <p className="text-sm text-white">Balanced Reasoning Score</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <ConfidenceRing value={86} />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* Section 6 */}
                <section className="space-y-5">
                    <SectionHeader
                        icon={<BarChart3 className="h-5 w-5" />}
                        title="Bias Reduction"
                        subtitle="Comparison before and after refinement"
                        iconClassName="text-indigo-300"
                        chipClassName="bg-indigo-500/10 border-indigo-400/20"
                    />

                    <div className="flex flex-wrap gap-3">
                        {largestDrop && (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200">
                                Largest drop: <span className="font-semibold text-white">{largestDrop.name}</span>
                            </span>
                        )}
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200">
                            Average reduction: <span className="font-semibold text-white">{avgReduction}%</span>
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200">
                            Reasoning improved across all bias categories
                        </span>
                    </div>

                    <ChartCard data={resultData.improvement} />
                </section>
            </div>
        </PageContainer>
    );
}