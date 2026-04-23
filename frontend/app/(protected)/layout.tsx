"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Brain } from "lucide-react";
import Sidebar from "@/components/biaslens/Sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    const sidebarWidth = collapsed ? "lg:pl-24" : "lg:pl-80";

    return (
        <div className="h-screen overflow-hidden bg-background text-white">
            {/* Fixed desktop sidebar */}
            <div className="hidden lg:block">
                <Sidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed((prev) => !prev)}
                />
            </div>

            {/* Main app area */}
            <div className={`relative flex h-screen flex-col ${sidebarWidth}`}>
                {/* Mobile top bar */}
                <div className="sticky top-0 z-30 border-b border-white/8 bg-background/80 backdrop-blur-xl lg:hidden">
                    <div className="flex items-center justify-between px-4 py-4">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                                <Brain className="h-5 w-5 text-violet-300" />
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-lg font-bold text-transparent">
                                    BiasLens
                                </h1>
                            </div>
                        </Link>

                        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}