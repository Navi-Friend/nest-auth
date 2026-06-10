import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/request/register.dto';
import { type Request, type Response } from 'express';
import { AuthResponse } from './dto/response/auth.dto';
import { EmailRequest } from './dto/request/email.dto';
import { LoginRequest } from './dto/request/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterRequest): Promise<{
        message: string;
    }>;
    login(dto: LoginRequest, req: Request): AuthResponse;
    refresh(refreshToken: string | null): Promise<void | AuthResponse>;
    logout(res: Response): void;
    me(req: Request): Express.User & {
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
        createdAt: Date;
        updatedAt: Date;
    };
    verifyEmail(token: string | null): Promise<AuthResponse>;
    resendEmail(dto: EmailRequest): Promise<{
        message: string;
    }>;
    googleAouth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
