import { AppLayout } from "@/shared/layouts/AppLayout";
import { AuthLayout } from "@/modules/auth/layouts/AuthLayout";
import { AuthCallbackPage } from "@/modules/auth/pages/AuthCallbackPage";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { ProfilePage } from "@/modules/profile/pages/ProfilePage";
import { SignupPage } from "@/modules/auth/pages/SignupPage";
import { ResendEmailPage } from "@/modules/auth/pages/ResendEmailPage";
import { createBrowserRouter, Navigate } from "react-router";
import { AuthVerifyEmailPage } from "@/modules/auth/pages/AuthVerifyEmailPage";
import { TwoFactorVerifyPage } from "./modules/auth/pages/2faVerifyPage";

export const router = createBrowserRouter([
    {
        Component: AuthLayout,
        children: [
            { index: true, element: <Navigate to="/login" replace /> },
            { path: "login", Component: LoginPage },
            { path: "auth/callback", Component: AuthCallbackPage },
            { path: "signup", Component: SignupPage },
            { path: "resend-email", Component: ResendEmailPage },
            { path: "verify-email", Component: AuthVerifyEmailPage },
            { path: "2fa-verify", Component: TwoFactorVerifyPage },
        ],
    },
    {
        Component: AppLayout,
        children: [{ path: "profile", Component: ProfilePage }],
    },
    { path: "*", Component: NotFoundPage },
]);
