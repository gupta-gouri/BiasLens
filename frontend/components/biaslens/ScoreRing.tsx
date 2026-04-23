"use client";

import { motion } from "framer-motion";

export default function ScoreRing() {
    return (
        <div className="flex items-center justify-center">
            <motion.div
                className="relative h-40 w-40 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute inset-3 rounded-full border border-primary/30" />
                <div className="absolute inset-6 rounded-full border border-secondary/30" />
            </motion.div>
        </div>
    );
}