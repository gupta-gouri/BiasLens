"use client";

import { useState } from "react";
import { Mic } from "lucide-react";

export default function InputBox({
    value,
    setValue,
}: {
    value: string;
    setValue: (val: string) => void;
}) {
    const [listening, setListening] = useState(false);

    const handleMic = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech not supported");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = "en-US";

        recognition.onstart = () => setListening(true);

        recognition.onresult = (event: any) => {
            setValue(event.results[0][0].transcript);
        };

        recognition.onend = () => setListening(false);

        recognition.start();
    };

    return (
        <div className="relative">
            <textarea
                placeholder="Type your thought here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full min-h-[160px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            <button
                onClick={handleMic}
                className="absolute bottom-3 right-3 rounded-full bg-primary/20 p-2 hover:bg-primary/30"
            >
                <Mic className={`h-5 w-5 ${listening ? "text-red-400" : ""}`} />
            </button>
        </div>
    );
}