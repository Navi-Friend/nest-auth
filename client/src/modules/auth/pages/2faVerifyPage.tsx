// src/pages/TwoFactorVerifyPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { useAuthStore } from "../store/auth-store";
import { OtpInputField } from "../components/OtpInputField";
import { useVerify2FALogin } from "../hooks/use2fa";
import { toast } from "sonner";

export function TwoFactorVerifyPage() {
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    const tempToken = useAuthStore((state) => state.tempToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const clearTempToken = useAuthStore((state) => state.clearTempToken);

    const verifyMutation = useVerify2FALogin();

    useEffect(() => {
        if (!tempToken) {
            navigate("/login", { replace: true });
        }
    }, [tempToken, navigate]);

    const handleVerify = () => {
        if (code.length !== 6) return;

        if (tempToken) {
            verifyMutation.mutate(
                { tempToken, code },
                {
                    onSuccess: (data) => {
                        setAccessToken(data.accessToken);
                        navigate("/profile");
                        toast.success("Welocome!");
                    },
                    onError: () => {
                        setCode("");
                    },
                },
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Проверка подлинности</CardTitle>
                    <CardDescription>
                        Введите 6-значный код из вашего приложения
                        аутентификации для завершения входа.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <OtpInputField
                        value={code}
                        onChange={setCode}
                        onSubmit={handleVerify}
                        isLoading={verifyMutation.isPending}
                        error={
                            verifyMutation.isError
                                ? "Неверный код или истекло время сессии"
                                : null
                        }
                    />

                    <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => {
                            clearTempToken();
                            navigate("/login");
                        }}
                        disabled={verifyMutation.isPending}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Вернуться к вводу пароля
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
