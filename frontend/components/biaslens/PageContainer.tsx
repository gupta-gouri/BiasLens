import * as React from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = {
    children: React.ReactNode;
    className?: string;
};

export function PageContainer({
    children,
    className,
}: PageContainerProps) {
    return (
        <main className={cn("relative min-h-screen w-full", className)}>
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </div>
        </main>
    );
}