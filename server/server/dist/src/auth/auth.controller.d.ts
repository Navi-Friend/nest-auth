import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/request/register.dto';
import { type Request, type Response } from 'express';
import { AuthResponse } from './dto/response/auth.dto';
import { EmailRequest } from './dto/request/email.dto';
import { LoginRequest } from './dto/request/login.dto';
import { ConfigService } from '@nestjs/config';
import type { User } from '../generated/prisma/client';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterRequest): Promise<{
        message: string;
    }>;
    login(dto: LoginRequest, id: number): AuthResponse;
    refresh(refreshToken: string | null): Promise<void | AuthResponse>;
    logout(res: Response): void;
    me(user: User): {
        name: string;
        email: string;
        password: string | null;
        id: number;
        verificationToken: string | null;
        googleId: string | null;
        isVerified: boolean;
        verificationTokenExpiresAt: Date | null;
        sendEmailAttempts: number;
        lastEmailSentAt: Date | null;
        twoFactorSecret: string | null;
        isTwoFactorEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    verifyEmail(token: string | null): Promise<AuthResponse>;
    resendEmail(dto: EmailRequest): Promise<{
        message: string;
    }>;
    googleAouth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
    generate2FACode(id: number): Promise<{
        secret: string;
        qrCodeDataURL: string;
    }>;
    enable2FA(id: number, code: string): Promise<void>;
    verify2FA(tempToken: string, code: string): Promise<void>;
}
