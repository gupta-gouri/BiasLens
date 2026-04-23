"use client";

export default function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: "Minimum 8 characters", valid: password.length >= 8 },
        { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "Lowercase letter", valid: /[a-z]/.test(password) },
        { label: "Number", valid: /[0-9]/.test(password) },
    ];

    return (
        <div className="space-y-2 text-xs">
            {checks.map((check, i) => (
                <div
                    key={i}
                    className={`flex items-center gap-2 ${check.valid ? "text-success" : "text-muted-foreground"
                        }`}
                >
                    <span>{check.valid ? "✔" : "•"}</span>
                    {check.label}
                </div>
            ))}
        </div>
    );
}