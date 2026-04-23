"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, ShieldCheck, Sparkles, ScanSearch } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageContainer } from "@/components/biaslens/PageContainer";

const steps = [
    {
        title: "Detecting biases",
        description: "Scanning your thought for cognitive distortion patterns.",
        icon: ScanSearch,
    },
    {
        title: "Extracting arguments",
        description: "Separating facts, assumptions, and conclusions.",
        icon: Brain,
    },
    {
        title: "Running cognitive firewall",
        description: "Applying challenge, evidence, and neutrality checks.",
        icon: ShieldCheck,
    },
    {
        title: "Improving reasoning",
        description: "Generating a clearer and more balanced perspective.",
        icon: Sparkles,
    },
];

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

function StrongLoader() {
    return (
        <div className="relative flex h-56 w-56 items-center justify-center">
            <motion.div
                className="absolute h-56 w-56 rounded-full border border-primary/25"
                animate={{ rotate: 360, scale: [1, 1.03, 1] }}
                transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            <motion.div
                className="absolute h-44 w-44 rounded-full border border-secondary/30"
                animate={{ rotate: -360, scale: [1, 1.04, 1] }}
                transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
            />

            <motion.div
                className="absolute h-32 w-32 rounded-full border border-white/15"
                animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.95, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute h-24 w-24 rounded-full bg-primary/20 blur-2xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute h-16 w-16 rounded-full bg-secondary/20 blur-xl"
                animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] shadow-[0_0_40px_rgba(108,99,255,0.35)] backdrop-blur-xl"
                animate={{
                    boxShadow: [
                        "0 0 20px rgba(108,99,255,0.18)",
                        "0 0 55px rgba(108,99,255,0.45)",
                        "0 0 20px rgba(108,99,255,0.18)",
                    ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
                <motion.div
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary"
                    animate={{ scale: [1, 1.22, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </div>
    );
}

export default function LoadingPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(8);

    const savedThought = useMemo(() => {
        if (typeof window === "undefined") return "";
        return sessionStorage.getItem("biaslens_thought") || "";
    }, []);

    useEffect(() => {
        const timers = [
            setTimeout(() => {
                setActiveStep(1);
                setProgress(32);
            }, 1200),
            setTimeout(() => {
                setActiveStep(2);
                setProgress(58);
            }, 2400),
            setTimeout(() => {
                setActiveStep(3);
                setProgress(84);
            }, 3600),
            setTimeout(() => {
                setProgress(100);
                router.push("/results");
            }, 5200),
        ];

        return () => timers.forEach(clearTimeout);
    }, [router]);

    return (
        <PageContainer className="flex h-screen items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.18),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(0,194,255,0.14),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(59,130,246,0.10),transparent_28%)]" />

                <AmbientOrb
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]"
                    duration={16}
                    x={[0, 26, -10, 0]}
                    y={[0, 24, 8, 0]}
                />
                <AmbientOrb
                    className="absolute right-[-80px] top-1/4 h-80 w-80 rounded-full bg-secondary/18 blur-[120px]"
                    duration={18}
                    x={[0, -20, 12, 0]}
                    y={[0, -24, 10, 0]}
                />
                <AmbientOrb
                    className="absolute bottom-[-100px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[120px]"
                    duration={20}
                    x={[0, 18, -18, 0]}
                    y={[0, -18, 8, 0]}
                />

                <motion.div
                    className="absolute inset-0 opacity-[0.055]"
                    animate={{ opacity: [0.04, 0.065, 0.04] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />
            </div>

            <div className="flex h-full w-full items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-4xl"
                >
                    <motion.div
                        className="absolute inset-0 -z-10 rounded-[32px] bg-primary/15 blur-3xl"
                        animate={{ opacity: [0.24, 0.42, 0.24], scale: [0.98, 1.03, 0.98] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <GlassCard className="relative rounded-[30px] px-6 py-8 md:px-8 md:py-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-primary/[0.06]" />

                        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[260px_1fr]">
                            <div className="flex flex-col items-center justify-center space-y-5 text-center">
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-primary via-violet-300 to-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent"
                                >
                                    BiasLens
                                </Link>

                                <StrongLoader />

                                <div className="space-y-2">
                                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        Analyzing your thought
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        AI is actively processing your reasoning.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {savedThought ? (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                        <p className="mb-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                            Original thought
                                        </p>
                                        <p className="line-clamp-3 text-sm leading-6 text-slate-300">
                                            {savedThought}
                                        </p>
                                    </div>
                                ) : null}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(108,99,255,0.45)]"
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive = index === activeStep;
                                        const isCompleted = index < activeStep;

                                        return (
                                            <motion.div
                                                key={step.title}
                                                initial={{ opacity: 0, x: 12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.08, duration: 0.45 }}
                                                className={[
                                                    "flex items-start gap-4 rounded-2xl border px-4 py-4 transition-all duration-300",
                                                    isActive
                                                        ? "border-primary/40 bg-gradient-to-r from-primary/14 to-secondary/10 shadow-[0_0_35px_rgba(108,99,255,0.2)]"
                                                        : isCompleted
                                                            ? "border-emerald-400/25 bg-emerald-400/10"
                                                            : "border-white/10 bg-white/[0.035]",
                                                ].join(" ")}
                                            >
                                                <div
                                                    className={[
                                                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                                                        isActive
                                                            ? "border-primary/40 bg-primary/18 text-primary shadow-[0_0_20px_rgba(108,99,255,0.3)]"
                                                            : isCompleted
                                                                ? "border-emerald-400/25 bg-emerald-400/12 text-emerald-300"
                                                                : "border-white/10 bg-white/[0.05] text-muted-foreground",
                                                    ].join(" ")}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-foreground md:text-base">
                                                            {step.title}
                                                        </p>
                                                        {isActive ? (
                                                            <motion.span
                                                                className="inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(108,99,255,0.9)]"
                                                                animate={{
                                                                    scale: [1, 1.5, 1],
                                                                    opacity: [0.55, 1, 0.55],
                                                                }}
                                                                transition={{ duration: 0.9, repeat: Infinity }}
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <p className="mt-1 text-xs leading-5 text-muted-foreground md:text-sm">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </PageContainer>
    );
}