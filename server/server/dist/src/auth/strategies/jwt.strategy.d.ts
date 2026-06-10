import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../interfaces/jwt.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
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
    }>;
}
export {};
