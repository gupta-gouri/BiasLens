import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
};

export function Button({
    children,
    className,
    variant = "primary",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/40",
                variant === "primary" && "bg-primary text-white hover:opacity-90",
                variant === "secondary" && "bg-white/10 text-white hover:bg-white/20",
                variant === "ghost" &&
                "bg-transparent text-muted-foreground hover:text-white",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}