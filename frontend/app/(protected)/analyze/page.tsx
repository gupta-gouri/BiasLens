"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, MicOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/biaslens/PageContainer";

declare global {
    interface Window {
        webkitSpeechRecognition?: new () => SpeechRecognition;
        SpeechRecognition?: new () => SpeechRecognition;
    }

    interface SpeechRecognition extends EventTarget {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        onstart: (() => void) | null;
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
        onend: (() => void) | null;
        start(): void;
        stop(): void;
    }

    interface SpeechRecognitionEvent {
        results: {
            [key: number]: {
                [key: number]: {
                    transcript: string;
                };
            };
            length: number;
        };
    }

    interface SpeechRecognitionErrorEvent {
        error: string;
    }
}

type MicState = "idle" | "listening" | "success" | "error";

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
                className="absolute left-[-300px] top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full border border-primary/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute left-[-250px] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full border border-secondary/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute right-[-300px] top-1/2 h-[900px] w-[900px] -translate-y-1/2 rounded-full border border-primary/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute right-[-250px] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full border border-secondary/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 105, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
}

export default function AnalyzePage() {
    const router = useRouter();
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const [thought, setThought] = useState("");
    const [micState, setMicState] = useState<MicState>("idle");
    const [micMessage, setMicMessage] = useState(
        "Tap the mic to speak your thought."
    );

    const placeholder = useMemo(
        () => "I should choose AI because everyone says web development is dead...",
        []
    );

    const startSpeechRecognition = () => {
        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            setMicState("error");
            setMicMessage("Speech recognition is not supported in this browser.");
            return;
        }

        try {
            const recognition = new SpeechRecognitionAPI();
            recognitionRef.current = recognition;

            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.continuous = false;

            recognition.onstart = () => {
                setMicState("listening");
                setMicMessage("Listening...");
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                setThought((prev) => (prev ? `${prev} ${transcript}` : transcript));
                setMicState("success");
                setMicMessage("Speech captured successfully.");
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                setMicState("error");

                if (
                    event.error === "not-allowed" ||
                    event.error === "service-not-allowed"
                ) {
                    setMicMessage("Microphone permission was denied.");
                } else {
                    setMicMessage("Could not capture speech. Please try again.");
                }
            };

            recognition.onend = () => {
                setMicState((prev) => (prev === "listening" ? "idle" : prev));
                setMicMessage((prev) =>
                    prev === "Listening..." ? "Tap the mic to speak your thought." : prev
                );
            };

            recognition.start();
        } catch {
            setMicState("error");
            setMicMessage("Unable to start microphone input.");
        }
    };

    const handleMicClick = () => {
        if (micState === "listening") {
            recognitionRef.current?.stop();
            setMicState("idle");
            setMicMessage("Microphone stopped.");
            return;
        }

        startSpeechRecognition();
    };

    const handleAnalyze = () => {
        if (!thought.trim()) return;

        if (typeof window !== "undefined") {
            sessionStorage.setItem("biaslens_thought", thought.trim());
        }

        router.push("/loading");
    };

    return (
        <PageContainer className="relative min-h-screen w-full overflow-hidden">
            {/* Base background */}
            <div className="pointer-events-none absolute inset-0 -z-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(0,194,255,0.12),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(59,130,246,0.08),transparent_28%),linear-gradient(135deg,#060b18_0%,#081224_45%,#050914_100%)]" />

                <AmbientOrb
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/18 blur-[120px]"
                    duration={16}
                    x={[0, 26, -10, 0]}
                    y={[0, 24, 8, 0]}
                />
                <AmbientOrb
                    className="absolute right-[-80px] top-1/4 h-80 w-80 rounded-full bg-secondary/16 blur-[120px]"
                    duration={18}
                    x={[0, -20, 12, 0]}
                    y={[0, -24, 10, 0]}
                />
                <AmbientOrb
                    className="absolute bottom-[-100px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[120px]"
                    duration={20}
                    x={[0, 18, -18, 0]}
                    y={[0, -18, 8, 0]}
                />

                <motion.div
                    className="absolute inset-0 opacity-[0.055]"
                    animate={{ opacity: [0.04, 0.06, 0.04] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                />

                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    }}
                />
            </div>

            {/* Side ring background */}
            <div className="pointer-events-none absolute inset-0 -z-20">
                <ThinkingRingBackground />
            </div>

            {/* Main content */}
            <div className="relative flex min-h-screen w-full items-center justify-center px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-[1400px]"
                >
                    <motion.div
                        className="absolute inset-0 -z-10 rounded-[32px] bg-primary/12 blur-3xl"
                        animate={{ opacity: [0.2, 0.34, 0.2], scale: [0.98, 1.02, 0.98] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <GlassCard
                        className="relative rounded-[28px] px-4 py-5 text-center md:px-5 md:py-6"
                        hover
                        glow
                    >
                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.07] via-transparent to-primary/[0.04]" />

                        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08, duration: 0.55 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-center">
                                    <Link
                                        href="/"
                                        className="bg-gradient-to-r from-primary via-violet-300 to-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl"
                                    >
                                        BiasLens
                                    </Link>
                                </div>

                                <div className="mx-auto max-w-xl space-y-3">
                                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                                        AI Reasoning Analysis
                                    </p>

                                    <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl md:leading-[1.05]">
                                        Analyze Your Thought
                                    </h1>

                                    <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                                        Let’s uncover hidden bias in your thinking.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.18, duration: 0.55 }}
                                className="mx-auto w-full max-w-[14060px] text-left"
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-xs leading-5 text-muted-foreground md:text-sm">
                                        We’ll detect possible cognitive bias, extract your
                                        assumptions, and suggest a more balanced perspective.
                                    </p>

                                    <div
                                        className={[
                                            "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium",
                                            micState === "listening"
                                                ? "border-red-400/30 bg-red-400/10 text-red-300"
                                                : micState === "success"
                                                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                                    : micState === "error"
                                                        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
                                                        : "border-white/10 bg-white/[0.04] text-muted-foreground",
                                        ].join(" ")}
                                    >
                                        {micState === "listening"
                                            ? "Listening"
                                            : micState === "success"
                                                ? "Captured"
                                                : micState === "error"
                                                    ? "Mic Error"
                                                    : "Mic Ready"}
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.045] backdrop-blur-xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                                    <div className="relative">
                                        <textarea
                                            value={thought}
                                            onChange={(e) => setThought(e.target.value)}
                                            placeholder={placeholder}
                                            className="min-h-[150px] w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-foreground outline-none placeholder:text-slate-500 md:min-h-[170px] md:px-5 md:py-5 md:text-[15px]"
                                        />

                                        <motion.button
                                            type="button"
                                            onClick={handleMicClick}
                                            whileHover={{ y: -2, scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={[
                                                "absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300",
                                                micState === "listening"
                                                    ? "border-red-400/30 bg-red-400/12 text-red-300 shadow-[0_0_25px_rgba(248,113,113,0.18)]"
                                                    : micState === "success"
                                                        ? "border-emerald-400/30 bg-emerald-400/12 text-emerald-300"
                                                        : micState === "error"
                                                            ? "border-amber-400/30 bg-amber-400/12 text-amber-300"
                                                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]",
                                            ].join(" ")}
                                            aria-label="Use microphone"
                                        >
                                            {micState === "listening" ? (
                                                <MicOff className="h-5 w-5" />
                                            ) : (
                                                <Mic className="h-5 w-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-muted-foreground">
                                    {micMessage}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.28, duration: 0.55 }}
                                className="flex justify-center"
                            >
                                <Button
                                    onClick={handleAnalyze}
                                    className="min-w-[220px] bg-gradient-to-r from-primary to-secondary text-white shadow-[0_12px_30px_rgba(108,99,255,0.24)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(108,99,255,0.34)] disabled:cursor-not-allowed disabled:opacity-50"
                                    disabled={!thought.trim()}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Analyze Thought
                                    </span>
                                </Button>
                            </motion.div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </PageContainer>
    );
}