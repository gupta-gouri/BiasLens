"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

type DashboardStatCardProps = {
    label: string;
    value: string;
    icon: React.ReactNode;
    accentClass: string;
    glowClass: string;
};

export default function DashboardStatCard({
    label,
    value,
    icon,
    accentClass,
    glowClass,
}: DashboardStatCardProps) {
    return (
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <GlassCard
                className={`relative overflow-hidden rounded-[26px] px-5 py-5 border-white/10 ${glowClass}`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-10`} />

                <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white">
                        {icon}
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}