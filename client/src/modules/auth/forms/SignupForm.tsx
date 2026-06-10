import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { signupSchema, type SignupInput } from "../forms/schemas/auth";
import { Button } from "@/shared//components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared//components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/shared//components/ui/field";
import { Input } from "@/shared//components/ui/input";
import { useSignup } from "@/modules/auth/hooks/useSignup";
import { API_URL } from "@/shared/api/api";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { ApiError } from "@/shared/api/api-error";
import { useAuthStore } from "../state/auth-state";

export function SignupForm() {
    const navigate = useNavigate();

    const form = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const authStore = useAuthStore((state) => state);

    const signupMutation = useSignup();

    const onSubmit = async (data: SignupInput) => {
        try {
            const res = await signupMutation.mutateAsync(data);

            toast.success(
                "To finish registration, please confirm your email. We sent a letter to your email",
            );

            authStore.setAccessToken(res.accessToken);
            navigate(`/resend-email?email=${data.email}`);
        } catch (error) {
            const apiError = new ApiError(error);

            toast.error(apiError.responseMessage);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <Card className="min-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Sign up</CardTitle>
                <CardDescription>
                    Create your account to get started
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="name-form">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="name-form"
                                        placeholder="John Doe"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="email-form">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="email-form"
                                        placeholder="john@example.com"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="password-form">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        type="password"
                                        id="password-form"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="confirm-password-form">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        type="password"
                                        id="confirm-password-form"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={signupMutation.isPending}>
                        {signupMutation.isPending
                            ? "Creating account..."
                            : "Sign up"}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login">
                        <Button variant="link" className="p-0">
                            Login
                        </Button>
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
