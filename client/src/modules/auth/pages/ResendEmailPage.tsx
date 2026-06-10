import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/shared//components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared//components/ui/card";
import { toast } from "sonner";
import { api } from "@/shared/api/api";

export function ResendEmailPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (!email || cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown, email]);

    const handleResend = async () => {
        if (!email || cooldown > 0) return;

        setIsResending(true);
        try {
            await api.post("/auth/resend-email", { email });
            toast.success("Verification email resent!");
            setCooldown(60); // Кулдаун 60 секунд
        } catch {
            toast.error("Failed to resend email");
        } finally {
            setIsResending(false);
        }
    };

    if (!email) {
        return (
            <Card className="min-w-md">
                <CardHeader>
                    <CardTitle>Invalid request</CardTitle>
                    <CardDescription>
                        Email parameter is missing.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link to="/login">
                        <Button variant="outline">Back to login</Button>
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="min-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Check your email
                </CardTitle>
                <CardDescription>
                    We've sent a verification link to <strong>{email}</strong>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Click the link in the email to verify your account. The link
                    will expire in 24 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or click
                    the button below to resend.
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
                <Button
                    onClick={handleResend}
                    disabled={isResending || cooldown > 0}
                    className="w-full">
                    {isResending ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : cooldown > 0 ? (
                        `Resend in ${cooldown}s`
                    ) : (
                        "Resend verification email"
                    )}
                </Button>
                <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
