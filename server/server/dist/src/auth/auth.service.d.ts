import { PrismaService } from '../prisma/prisma.service';
import { RegisterRequest } from './dto/request/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/response/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../generated/prisma/client';
import { GoogleUser } from './interfaces/google-user.interface';
export declare class AuthService {
    private readonly prismaService;
    private readonly configService;
    private readonly jwtService;
    private readonly mailerService;
    private readonly JWT_ACCESS_TOKEN_TTL;
    private readonly JWT_REFRESH_TOKEN_TTL;
    private readonly FRONTEND_URL;
    private readonly VERIVICATION_TOKEN_TTL_MS;
    private readonly MAX_EMAIL_ATTEMPTS;
    private readonly ATTEMMPTS_PERIOD_MS;
    constructor(prismaService: PrismaService, configService: ConfigService, jwtService: JwtService, mailerService: MailerService);
    register(dto: RegisterRequest): Promise<{
        message: string;
    }>;
    login(id: number): AuthResponse;
    private generateTokens;
    refresh(refreshToken: string | null): Promise<AuthResponse | void>;
    validateJwt(id: number): Promise<User>;
    validateLocal(email: string, password: string): Promise<User>;
    verifyEmail(token: string): Promise<AuthResponse>;
    resendEmail(email: string): Promise<{
        message: string;
    }>;
    private sendEmailToken;
    loginOrRegisterWithGoogle(user: GoogleUser): Promise<AuthResponse>;
    private sleep;
}
