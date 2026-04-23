import * as React from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    className?: string;
};

export function SectionHeading({
    eyebrow,
    title,
    description,
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                    {eyebrow}
                </p>
            ) : null}

            <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {title}
                </h1>

                {description ? (
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}