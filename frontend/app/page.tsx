"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/biaslens/PageContainer";

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

function ThinkingRingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-[1400px] w-[1400px] -translate-x-[60%] -translate-y-[50%] rounded-full border border-primary/20 shadow-[0_0_80px_rgba(108,99,255,0.15)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[1120px] w-[1120px] -translate-x-[60%] -translate-y-[50%] rounded-full border border-secondary/20 shadow-[0_0_80px_rgba(108,99,255,0.15)]"
        animate={{ rotate: -360 }}
        transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-[60%] -translate-y-[50%] rounded-full border border-white/10 shadow-[0_0_80px_rgba(108,99,255,0.15)]"
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[140px]"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.22, 0.42, 0.22],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <PageContainer className="relative min-h-screen w-full overflow-hidden">
      {/* Base background */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,99,255,0.10),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(0,194,255,0.08),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.06),transparent_26%),linear-gradient(135deg,#060b18_0%,#081224_45%,#050914_100%)]" />

        <AmbientOrb
          className="absolute left-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-primary/18 blur-[150px]"
          duration={18}
          x={[0, 30, -12, 0]}
          y={[0, 26, 8, 0]}
        />
        <AmbientOrb
          className="absolute right-[-180px] top-[18%] h-[420px] w-[420px] rounded-full bg-secondary/14 blur-[150px]"
          duration={20}
          x={[0, -22, 14, 0]}
          y={[0, -24, 10, 0]}
        />
        <AmbientOrb
          className="absolute bottom-[-180px] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[150px]"
          duration={22}
          x={[0, 16, -16, 0]}
          y={[0, -18, 8, 0]}
        />

        <motion.div
          className="absolute inset-0 opacity-[0.05]"
          animate={{ opacity: [0.04, 0.06, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Full-page thinking ring layer */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <ThinkingRingBackground />
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen w-full items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[760px]"
        >
          <motion.div
            className="absolute inset-0 -z-10 rounded-[32px] bg-primary/10 blur-3xl"
            animate={{ opacity: [0.14, 0.24, 0.14], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <GlassCard
            className="relative rounded-[32px] px-6 py-8 md:px-8 md:py-9"
            hover
            glow
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.05] via-transparent to-primary/[0.03]" />

            <div className="relative z-10 mx-auto max-w-[560px] space-y-7 text-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <motion.h1
                    className="bg-gradient-to-r from-primary via-violet-300 to-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    BiasLens
                  </motion.h1>
                </div>

                <div className="mx-auto max-w-xl space-y-3">
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.04]">
                    Think Better. Decide Smarter.
                  </h2>
                  <p className="mx-auto max-w-lg text-sm leading-7 text-muted-foreground md:text-lg">
                    Uncover hidden cognitive biases in your thinking and improve
                    your decisions with AI.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.55 }}
                className="mx-auto max-w-[520px] rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-5 text-left backdrop-blur-md"
              >
                <p className="text-sm italic leading-7 text-slate-200 md:text-base">
                  “I should choose AI because everyone says web development is
                  dead.”
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300">
                    Confirmation Bias
                  </span>
                  <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
                    Social Influence
                  </span>
                  <span className="ml-auto text-xs font-medium text-slate-400">
                    Confidence: 78%
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.55 }}
                className="flex flex-col items-center justify-center gap-3 pt-1 sm:flex-row"
              >
                <Link href="/analyze">
                  <Button className="min-w-[210px] bg-gradient-to-r from-primary to-secondary text-white shadow-[0_12px_30px_rgba(108,99,255,0.24)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(108,99,255,0.34)]">
                    Start Analyzing →
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="min-w-[150px] border border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
                  >
                    Login
                  </Button>
                </Link>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageContainer>
  );
}