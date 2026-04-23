import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={cn(
                "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white",
                "placeholder:text-muted-foreground",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                "transition-all",
                className
            )}
            {...props}
        />
    );
}