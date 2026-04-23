"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

type BiasCardProps = {
    name: string;
    score: number;
};

export default function BiasCard({ name, score }: BiasCardProps) {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <GlassCard className="h-full rounded-[24px] p-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Bias detected</p>
                        <h3 className="mt-1 text-base font-semibold text-foreground">{name}</h3>
                    </div>

                    <div className="relative flex h-20 w-20 items-center justify-center">
                        <svg className="h-20 w-20 -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                stroke="rgba(255,255,255,0.08)"
                                strokeWidth="7"
                                fill="transparent"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                stroke="url(#biasGradient)"
                                strokeWidth="7"
                                strokeLinecap="round"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                            <defs>
                                <linearGradient id="biasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6C63FF" />
                                    <stop offset="100%" stopColor="#00C2FF" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="absolute text-sm font-semibold text-white">{score}%</span>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}