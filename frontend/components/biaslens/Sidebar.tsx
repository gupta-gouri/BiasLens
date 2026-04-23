"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Brain,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Search,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        accent: "from-violet-500 to-indigo-500",
    },
    {
        label: "Analyze",
        href: "/analyze",
        icon: Search,
        accent: "from-cyan-400 to-blue-500",
    },
    {
        label: "Results",
        href: "/results",
        icon: Brain,
        accent: "from-fuchsia-500 to-violet-500",
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        accent: "from-amber-400 to-orange-500",
    },
];

type SidebarProps = {
    collapsed: boolean;
    onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 hidden h-screen border-r border-white/8 bg-white/[0.03] backdrop-blur-2xl lg:flex lg:flex-col",
                collapsed ? "w-[92px]" : "w-[280px]"
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(108,99,255,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(0,194,255,0.08),transparent_18%)]" />

            <div className="relative z-10 flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-5">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center gap-3 overflow-hidden",
                            collapsed && "justify-center"
                        )}
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_0_25px_rgba(108,99,255,0.12)]">
                            <Brain className="h-5 w-5 text-violet-300" />
                        </div>

                        {!collapsed ? (
                            <div>
                                <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                                    BiasLens
                                </h1>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                    Cognitive AI
                                </p>
                            </div>
                        ) : null}
                    </Link>

                    {!collapsed ? (
                        <button
                            onClick={onToggle}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition hover:bg-white/[0.08] hover:text-white"
                            aria-label="Collapse sidebar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    ) : null}
                </div>

                {collapsed ? (
                    <div className="px-5 pb-3">
                        <button
                            onClick={onToggle}
                            className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition hover:bg-white/[0.08] hover:text-white"
                            aria-label="Expand sidebar"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                ) : null}

                {/* Nav */}
                <nav className="mt-2 flex-1 space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 transition-all duration-300",
                                    isActive
                                        ? "border-white/12 bg-white/[0.08] shadow-[0_0_24px_rgba(108,99,255,0.10)]"
                                        : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.04]",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {isActive ? (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className={cn(
                                            "absolute inset-0 bg-gradient-to-r opacity-10",
                                            item.accent
                                        )}
                                    />
                                ) : null}

                                <div
                                    className={cn(
                                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]",
                                        isActive &&
                                        `bg-gradient-to-r ${item.accent} border-transparent text-white`
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>

                                {!collapsed ? (
                                    <div className="relative z-10 min-w-0">
                                        <p
                                            className={cn(
                                                "text-sm font-medium",
                                                isActive ? "text-white" : "text-slate-300"
                                            )}
                                        >
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.label === "Dashboard"
                                                ? "Overview & insights"
                                                : item.label === "Analyze"
                                                    ? "Input reasoning"
                                                    : item.label === "Results"
                                                        ? "AI report"
                                                        : "Preferences"}
                                        </p>
                                    </div>
                                ) : null}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 pb-5 pt-4">
                    <button
                        className={cn(
                            "flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-slate-300 transition hover:bg-white/[0.08] hover:text-white",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                            <LogOut className="h-5 w-5" />
                        </div>

                        {!collapsed ? (
                            <div className="text-left">
                                <p className="text-sm font-medium">Logout</p>
                                <p className="text-xs text-muted-foreground">Exit session</p>
                            </div>
                        ) : null}
                    </button>
                </div>
            </div>
        </aside>
    );
}