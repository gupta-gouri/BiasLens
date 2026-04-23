import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    hover?: boolean;
    glow?: boolean;
};

export function GlassCard({
    children,
    className,
    hover = true,
    glow = true,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10",
                "bg-white/[0.03] backdrop-blur-xl",
                "transition-all duration-300 ease-out",
                hover &&
                "hover:-translate-y-1 hover:scale-[1.015] hover:border-white/15",
                glow &&
                "hover:shadow-[0_0_0_1px_rgba(108,99,255,0.2),0_10px_40px_rgba(108,99,255,0.25)]",
                className
            )}
            {...props}
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-secondary/10" />
            <div className="relative z-10 p-6 md:p-8">{children}</div>
        </div>
    );
}