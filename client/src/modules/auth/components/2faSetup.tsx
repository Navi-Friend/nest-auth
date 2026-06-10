import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Copy, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { toast } from "sonner";
import { OtpInputField } from "./OtpInputField";
import { useGenerate2FA, useEnable2FA } from "../hooks/use2fa";
import { useUserStore } from "@/modules/profile/store/user-store";

export function TwoFactorSetup() {
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"initial" | "scanning" | "success">("initial");

    const user = useUserStore((state) => state.user);
    const generateMutation = useGenerate2FA();
    const enableMutation = useEnable2FA();

    if (user?.isTwoFactorEnabled || step === 'success') {
        return (
            <Card className="w-full min-w-45 mx-auto text-center border-green-200">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                    <CardTitle>Двухфакторная аутентификация включена</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    const handleGenerate = () => {
        generateMutation.mutate(undefined, {
            onSuccess: () => setStep("scanning"),
        });
    };

    const handleEnable = () => {
        if (code.length !== 6) return;

        enableMutation.mutate(code, {
            onSuccess: () => {
                setStep("success");
                setCode("");
                toast.success(
                    "Двухфакторная аутентификация успешно включена!",
                    {
                        duration: 3000,
                    },
                );
            },
            onError: () => {
                setCode("");
                enableMutation.reset();
                toast.error("Неверный код. Попробуйте снова.");
            },
        });
    };

    const copySecret = () => {
        if (generateMutation.data?.secret) {
            navigator.clipboard.writeText(generateMutation.data.secret);
            toast.success("Секретный ключ скопирован");
        }
    };

    if (step === "scanning" && generateMutation.data) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle>Настройка 2FA</CardTitle>
                    <CardDescription className="text-sm">
                        1. Отсканируйте QR-код в Google Authenticator или Authy
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg border">
                        <QRCodeSVG
                            value={generateMutation.data.otpAuthUrl}
                            size={200}
                            level="H"
                            className="bg-white p-2 rounded"
                        />
                        <div className="mt-4 w-full">
                            <p className="text-xs text-center text-muted-foreground mb-2">
                                Или введите этот ключ вручную:
                            </p>
                            <div className="flex items-center justify-between gap-2 bg-background p-2 rounded border">
                                <code className="text-sm font-mono tracking-wider truncate">
                                    {generateMutation.data.secret}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={copySecret}
                                    className="h-8 w-8 shrink-0">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-center text-muted-foreground">
                            2. Введите 6-значный код из приложения:
                        </p>
                        <div className="w-full flex justify-center">
                            <OtpInputField
                                value={code}
                                onChange={setCode}
                                onSubmit={handleEnable}
                                isLoading={enableMutation.isPending}
                                error={
                                    enableMutation.isError
                                        ? "Неверный код"
                                        : null
                                }
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setStep("initial");
                                setCode("");
                            }}
                            disabled={enableMutation.isPending}>
                            Отмена
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Состояние: Начальное (по умолчанию)
    return (
        <Card className="w-full min-w-45 mx-auto text-center">
            <CardHeader>
                <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle>Защитите свой аккаунт</CardTitle>
                <CardDescription>
                    Включите двухфакторную аутентификацию для дополнительной
                    безопасности
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    onClick={handleGenerate}
                    className="w-full"
                    disabled={generateMutation.isPending}>
                    {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Настроить 2FA
                </Button>
            </CardContent>
        </Card>
    );
}
