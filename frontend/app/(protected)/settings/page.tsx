"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    User,
    SlidersHorizontal,
    Save,
    RotateCcw,
} from "lucide-react";

import { PageContainer } from "@/components/biaslens/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

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

function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`relative h-7 w-12 rounded-full border transition-all duration-300 ${checked
                    ? "border-cyan-400/30 bg-cyan-500/20"
                    : "border-white/10 bg-white/[0.05]"
                }`}
        >
            <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 ${checked ? "left-6" : "left-1"
                    }`}
            />
        </button>
    );
}

export default function SettingsPage() {
    const [form, setForm] = useState({
        displayName: "Gouri Gupta",
        email: "gouri@example.com",
        defaultTone: "Balanced",
        showConfidenceScore: true,
    });

    const handleReset = () => {
        setForm({
            displayName: "Gouri Gupta",
            email: "gouri@example.com",
            defaultTone: "Balanced",
            showConfidenceScore: true,
        });
    };

    const handleSave = () => {
        alert("Settings saved locally for now.");
    };

    return (
        <PageContainer className="min-h-screen overflow-hidden py-8">
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

            <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <GlassCard className="relative overflow-hidden rounded-[30px] border border-violet-400/18 px-6 py-6 md:px-8 md:py-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/6" />

                        <div className="relative z-10">
                            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                Basic Settings
                            </span>

                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                                Manage your preferences
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                                Keep your profile and analysis preferences simple and ready for easy backend integration later.
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                    <SectionHeader
                        icon={<User className="h-5 w-5" />}
                        title="Profile"
                        subtitle="Basic account information."
                        iconClassName="text-violet-300"
                        chipClassName="bg-violet-500/10 border-violet-400/20"
                    />

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Display name</label>
                            <input
                                value={form.displayName}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, displayName: e.target.value }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-violet-400/30 focus:bg-white/[0.06]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Email</label>
                            <input
                                value={form.email}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, email: e.target.value }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-400/30 focus:bg-white/[0.06]"
                            />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                    <SectionHeader
                        icon={<SlidersHorizontal className="h-5 w-5" />}
                        title="Preferences"
                        subtitle="A few key analysis options."
                        iconClassName="text-cyan-300"
                        chipClassName="bg-cyan-500/10 border-cyan-400/20"
                    />

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">
                                Default analysis tone
                            </label>
                            <select
                                value={form.defaultTone}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, defaultTone: e.target.value }))
                                }
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-cyan-400/30"
                            >
                                <option className="bg-slate-900">Balanced</option>
                                <option className="bg-slate-900">Strict</option>
                                <option className="bg-slate-900">Supportive</option>
                                <option className="bg-slate-900">Analytical</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                            <div>
                                <p className="text-sm font-medium text-white">Show confidence score</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Display the confidence indicator in the results page.
                                </p>
                            </div>

                            <Toggle
                                checked={form.showConfidenceScore}
                                onChange={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        showConfidenceScore: !prev.showConfidenceScore,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="rounded-[28px] border border-white/10 px-6 py-6 md:px-8 md:py-8">
                    <SectionHeader
                        icon={<SettingsIcon className="h-5 w-5" />}
                        title="Actions"
                        subtitle="Save or reset your current settings."
                        iconClassName="text-amber-300"
                        chipClassName="bg-amber-500/10 border-amber-400/20"
                    />

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 shadow-[0_10px_25px_rgba(108,99,255,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(108,99,255,0.3)]"
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.1]"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    </div>
                </GlassCard>
            </div>
        </PageContainer>
    );
}