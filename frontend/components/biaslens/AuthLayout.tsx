"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
    children,
    title,
    subtitle,
}: {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background text-white">

            {/* LEFT PANEL */}
            <div className="hidden md:flex relative items-center justify-center p-10">

                {/* Glow background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 blur-[120px] rounded-full" />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-md space-y-6"
                >
                    <h1 className="text-5xl font-bold">
                        <span className="text-primary">Bias</span>
                        <span className="text-secondary">Lens</span>
                    </h1>

                    <p className="text-lg text-muted-foreground">
                        Think clearly. Detect bias. Make smarter decisions with AI.
                    </p>

                    {/* Testimonial style */}
                    <div className="glass-panel p-5 rounded-2xl text-sm text-muted-foreground">
                        “BiasLens helped me realize how much my decisions were influenced by others. Now I think independently.”
                    </div>
                </motion.div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex items-center justify-center px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-6"
                >
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-semibold">{title}</h2>
                        <p className="text-muted-foreground text-sm">{subtitle}</p>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
}