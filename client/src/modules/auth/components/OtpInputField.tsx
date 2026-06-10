import { useEffect, useRef } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/shared/components/ui/input-otp";
import { cn } from "@/shared/lib/utils";

interface OtpInputFieldProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    error?: string | null;
}

export function OtpInputField({
    value,
    onChange,
    onSubmit,
    isLoading,
    error,
}: OtpInputFieldProps) {
    useEffect(() => {
        if (value.length === 6 && !isLoading) {
            onSubmit();
        }
    }, [value, isLoading, onSubmit]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (error || value === "") {
            // Небольшая задержка, чтобы React успел перерисовать
            const timer = setTimeout(() => {
                // Находим первый input внутри контейнера и фокусируем его
                const firstSlot = containerRef.current?.querySelector("input");
                firstSlot?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [error, value]);

    return (
        <div ref={containerRef} className='flex items-center flex-col'>
            <InputOTP
                maxLength={6}
                value={value}
                onChange={onChange}
                disabled={isLoading}
                className={cn(
                    error && "**:data-[slot=input-otp-slot]:border-red-500",
                )}>
                <InputOTPGroup className="*:w-8 *:h-8 *:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="*:w-8 *:h-8 *:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>

            {error && (
                <p className="text-sm text-red-500 text-center animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
