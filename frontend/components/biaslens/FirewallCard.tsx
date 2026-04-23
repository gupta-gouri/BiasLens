import { GlassCard } from "@/components/ui/GlassCard";

export default function FirewallCard({
    title,
    points,
}: {
    title: string;
    points: string[];
}) {
    return (
        <GlassCard className="h-full rounded-[24px] p-5">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                {points.map((point) => (
                    <li key={point} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </GlassCard>
    );
}