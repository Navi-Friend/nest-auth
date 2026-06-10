import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { loginSchema, type LoginInput } from "../forms/schemas/auth";
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
import { useLogin } from "@/modules/auth/hooks/userLogin";
import { API_URL } from "@/shared/api/api";
import { Link } from "react-router";

export function LoginForm() {
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const loginMutation = useLogin();

    const onSubmit = async (data: LoginInput) => {
        loginMutation.mutate(data);
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <Card className="min-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email and password to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
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
                            )}></Controller>
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
                            )}></Controller>
                    </FieldGroup>
                    <Button type="submit" className="w-full">
                        Sign in
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
                    Don't have an account?{" "}
                    <Link to="/signup">
                        <Button variant="link" className="p-0">
                            Sign up
                        </Button>
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
