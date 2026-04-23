"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/biaslens/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // temporary mock login
        if (!form.username || !form.password) {
            alert("Please fill in both fields.");
            return;
        }

        router.push("/dashboard");
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Login to continue your journey"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                    }
                />

                <Input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <Button type="submit" className="w-full">
                    Login
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Don’t have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}