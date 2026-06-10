"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2_1 = require("argon2");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const mailer_1 = require("@nestjs-modules/mailer");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
let AuthService = class AuthService {
    prismaService;
    configService;
    jwtService;
    mailerService;
    JWT_ACCESS_TOKEN_TTL;
    JWT_REFRESH_TOKEN_TTL;
    FRONTEND_URL;
    VERIVICATION_TOKEN_TTL_MS;
    MAX_EMAIL_ATTEMPTS;
    ATTEMMPTS_PERIOD_MS;
    constructor(prismaService, configService, jwtService, mailerService) {
        this.prismaService = prismaService;
        this.configService = configService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
        this.FRONTEND_URL = this.configService.getOrThrow('FRONTEND_URL');
        this.VERIVICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;
        this.MAX_EMAIL_ATTEMPTS = 3;
        this.ATTEMMPTS_PERIOD_MS = 60 * 60 * 1000;
    }
    async register(dto) {
        const { name, email, password } = dto;
        const existing = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        await this.prismaService.user.create({
            data: {
                email,
                name,
                password: await (0, argon2_1.hash)(password),
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + this.VERIVICATION_TOKEN_TTL_MS),
                isVerified: false,
            },
        });
        this.sendEmailToken(email, name, verificationToken);
        return {
            message: 'User successfully created. Check email to complete registration',
        };
    }
    login(id) {
        return this.generateTokens(id);
    }
    generateTokens(id) {
        const payload = { id };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL,
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL,
        });
        return { accessToken, refreshToken };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is not valid');
        }
        const payload = await this.jwtService.verifyAsync(refreshToken);
        if (payload) {
            const user = await this.prismaService.user.findUnique({
                where: { id: payload.id },
                select: { id: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('User is not found');
            }
            return this.generateTokens(user.id);
        }
    }
    async validateJwt(id) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User is not found');
        }
        return user;
    }
    async validateLocal(email, password) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('Incorrect email or password');
        }
        if (!user.password) {
            throw new common_1.BadRequestException('No password has been set for this account. Log in via Google or restore the password using the link in the mail');
        }
        const isValidPassword = await (0, argon2_1.verify)(user.password, password);
        if (!isValidPassword) {
            throw new common_1.NotFoundException('Incorrect email or password');
        }
        if (!user.isVerified) {
            throw new common_1.ForbiddenException('Email is not verified');
        }
        return user;
    }
    async verifyEmail(token) {
        const user = await this.prismaService.user.findUnique({
            where: { verificationToken: token },
        });
        if (!user ||
            (user.verificationTokenExpiresAt &&
                user.verificationTokenExpiresAt < new Date())) {
            throw new common_1.BadRequestException('Link is invalid or expired');
        }
        await this.prismaService.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpiresAt: null,
            },
        });
        return this.generateTokens(user.id);
    }
    async resendEmail(email) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        await this.sleep(500);
        if (user && !user.isVerified) {
            let attempts = user.sendEmailAttempts;
            const now = new Date();
            if (user.lastEmailSentAt &&
                now.getTime() - user.lastEmailSentAt.getTime() >
                    this.ATTEMMPTS_PERIOD_MS) {
                attempts = 0;
            }
            if (attempts < this.MAX_EMAIL_ATTEMPTS) {
                const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
                const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                await this.prismaService.user.update({
                    where: { id: user.id },
                    data: {
                        verificationToken,
                        verificationTokenExpiresAt: expiresAt,
                        sendEmailAttempts: attempts + 1,
                        lastEmailSentAt: now,
                    },
                });
                this.sendEmailToken(user.email, user.name, verificationToken);
            }
        }
        return {
            message: 'If the account exists and has not been verified, a new link has been sent.',
        };
    }
    sendEmailToken(email, name, token) {
        const verifyUrl = `${this.FRONTEND_URL}/verify-email?token=${token}`;
        this.mailerService
            .sendMail({
            to: email,
            subject: 'Confirm your account',
            html: `<h2>Hello ${name} Thank your for registration at "Nest auth app"</h2>
			        <p>Click the button below to confirm your email:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Confirm email</a>
        <p>Or follow the link: <a href="${verifyUrl}">${verifyUrl}</a></p>
        <p><small>The link is valid for 24 hours. If you haven't registered, ignore the email.</small></p>`,
        })
            .catch((err) => {
            console.error(`Failed to send verification email to ${email}`, err);
        });
    }
    async loginOrRegisterWithGoogle(user) {
        let existingUser = await this.prismaService.user.findUnique({
            where: { googleId: user.googleId },
        });
        if (existingUser) {
            return this.generateTokens(existingUser.id);
        }
        existingUser = await this.prismaService.user.findUnique({
            where: { email: user.email },
        });
        if (existingUser) {
            existingUser = await this.prismaService.user.update({
                where: { id: existingUser.id },
                data: {
                    googleId: user.googleId,
                    isVerified: true,
                    verificationToken: null,
                    verificationTokenExpiresAt: null,
                },
            });
            return this.generateTokens(existingUser.id);
        }
        existingUser = await this.prismaService.user.create({
            data: {
                email: user.email,
                name: user.name,
                googleId: user.googleId,
                isVerified: true,
            },
        });
        return this.generateTokens(existingUser.id);
    }
    async sleep(ms) {
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
    }
    async generate2FACode(id) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const secret = (0, otplib_1.generateSecret)();
        const otpauthUrl = (0, otplib_1.generateURI)({
            strategy: 'totp',
            issuer: 'Nest-auth app',
            secret,
            label: user.email,
        });
        const qrCodeDataURL = await (0, qrcode_1.toDataURL)(otpauthUrl);
        await this.prismaService.user.update({
            where: { email: user.email },
            data: {
                twoFactorSecret: secret,
            },
        });
        return { secret, qrCodeDataURL };
    }
    async enable2FA(id, code) {
        const user = await this.prismaService.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const secret = user.twoFactorSecret;
        if (!secret) {
            throw new common_1.BadRequestException('Firstly generate a secret');
        }
        const isVerified = await (0, otplib_1.verify)({
            secret,
            token: code,
        });
    }
    async verify2FALogin(id, code) { }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map