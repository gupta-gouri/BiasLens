"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/components/biaslens/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import PasswordStrength from "@/components/biaslens/PasswordStrength";

export default function SignupPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // temporary frontend-only redirect
        router.push("/dashboard");
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start improving your decisions today"
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

                <PasswordStrength password={form.password} />

                <Button type="submit" className="w-full">
                    Create Account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}