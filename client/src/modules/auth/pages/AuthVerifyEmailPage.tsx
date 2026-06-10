import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/shared//components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared//components/ui/card";
import { useVerifyEmail } from "@/modules/auth/hooks/useVerifyEmail";
import { useAuthStore } from "../store/auth-store";

export function AuthVerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const token = searchParams.get("token");
    const { data, isPending, isError, error } = useVerifyEmail(token);

    useEffect(() => {
        if (data?.accessToken) {
            setAccessToken(data.accessToken);
            setTimeout(() => navigate("/profile", { replace: true }), 2000);
        }
    }, [data, navigate, setAccessToken]);

    return (
        <Card className="min-w-md">
            <CardHeader>
                {isPending && (
                    <>
                        <CardTitle className="flex items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Verifying your email...
                        </CardTitle>
                        <CardDescription>Please wait.</CardDescription>
                    </>
                )}
                {data && !isPending && (
                    <>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Email verified!
                        </CardTitle>
                        <CardDescription>
                            Redirecting to your profile...
                        </CardDescription>
                    </>
                )}
                {isError && (
                    <>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-6 w-6" />
                            Verification failed
                        </CardTitle>
                        <CardDescription>
                            {(error as any)?.response?.data?.message ||
                                "The verification link is invalid or has expired."}
                        </CardDescription>
                    </>
                )}
            </CardHeader>

            <CardContent>
                {isPending && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {isError && (
                    <p className="text-sm text-muted-foreground">
                        The link may have expired (valid for 24 hours) or
                        already been used.
                    </p>
                )}
            </CardContent>

            {isError && (
                <CardFooter className="flex flex-col gap-2">
                    <Link to="/verify-email" className="w-full">
                        <Button className="w-full">
                            <Mail className="mr-2 h-4 w-4" />
                            Resend verification email
                        </Button>
                    </Link>
                    <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                            Back to login
                        </Button>
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
}
