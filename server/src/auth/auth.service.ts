import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRequest } from './dto/request/register.dto';
import { verify, hash } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';
import { AuthResponse } from './dto/response/auth.dto';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../generated/prisma/client';
import { GoogleUser } from './interfaces/google-user.interface';
import { generateSecret, generateURI, verify as otpVerify } from 'otplib';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
	private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];

	private readonly FRONTEND_URL: string;
	private readonly VERIVICATION_TOKEN_TTL_MS: number;

	private readonly MAX_EMAIL_ATTEMPTS: number;
	private readonly ATTEMMPTS_PERIOD_MS: number;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_ACCESS_TOKEN_TTL',
		) as JwtSignOptions['expiresIn'];
		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_REFRESH_TOKEN_TTL',
		) as JwtSignOptions['expiresIn'];

		this.FRONTEND_URL = this.configService.getOrThrow<string>('FRONTEND_URL');

		this.VERIVICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

		this.MAX_EMAIL_ATTEMPTS = 3;
		this.ATTEMMPTS_PERIOD_MS = 60 * 60 * 1000;
	}

	async register(dto: RegisterRequest): Promise<{ message: string }> {
		const { name, email, password } = dto;

		const existing = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (existing) {
			throw new ConflictException('User with this email already exists');
		}

		const verificationToken = randomBytes(32).toString('hex');

		await this.prismaService.user.create({
			data: {
				email,
				name,
				password: await hash(password),
				verificationToken,
				verificationTokenExpiresAt: new Date(
					Date.now() + this.VERIVICATION_TOKEN_TTL_MS,
				),
				isVerified: false,
			},
		});

		this.sendEmailToken(email, name, verificationToken);

		return {
			message:
				'User successfully created. Check email to complete registration',
		};
	}

	login(
		id: number,
		isTwoFactorEnabled: boolean,
	): AuthResponse | { tempToken: string; requires2FA: true } {
		if (isTwoFactorEnabled) {
			const tempPayload: JwtPayload = { id, type: '2fa' };
			const tempToken = this.jwtService.sign(tempPayload, {
				expiresIn: '5m',
			});

			return { tempToken, requires2FA: true };
		}
		return this.generateTokens(id);
	}

	private generateTokens(id: number): AuthResponse {
		const accessPayload: JwtPayload = { id, type: 'access' };
		const refreshPayload: JwtPayload = { id, type: 'refresh' };

		const accessToken = this.jwtService.sign(accessPayload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL,
		});

		const refreshToken = this.jwtService.sign(refreshPayload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL,
		});

		return { accessToken, refreshToken };
	}

	async refresh(refreshToken: string | null): Promise<AuthResponse | void> {
		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token is not valid');
		}

		const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

		if (payload) {
			const user = await this.prismaService.user.findUnique({
				where: { id: payload.id },
				select: { id: true },
			});

			if (!user) {
				throw new NotFoundException('User is not found');
			}

			return this.generateTokens(user.id);
		}
	}

	async validateJwt(id: number): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException('User is not found');
		}

		return user;
	}

	async validateLocal(email: string, password: string): Promise<User> {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new NotFoundException('Incorrect email or password');
		}

		if (!user.password) {
			throw new BadRequestException(
				'No password has been set for this account. Log in via Google or restore the password using the link in the mail',
			);
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new NotFoundException('Incorrect email or password');
		}

		if (!user.isVerified) {
			throw new ForbiddenException('Email is not verified');
		}

		return user;
	}

	async verifyEmail(token: string): Promise<AuthResponse> {
		const user = await this.prismaService.user.findUnique({
			where: { verificationToken: token },
		});

		if (
			!user ||
			(user.verificationTokenExpiresAt &&
				user.verificationTokenExpiresAt < new Date())
		) {
			throw new BadRequestException('Link is invalid or expired');
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

	async resendEmail(email: string): Promise<{ message: string }> {
		const user = await this.prismaService.user.findUnique({
			where: { email },
		});

		// 🛡 1. Выравниваем время ответа для любых email
		await this.sleep(500);

		if (user && !user.isVerified) {
			let attempts = user.sendEmailAttempts;
			const now = new Date();

			if (
				user.lastEmailSentAt &&
				now.getTime() - user.lastEmailSentAt.getTime() >
					this.ATTEMMPTS_PERIOD_MS
			) {
				attempts = 0;
			}

			if (attempts < this.MAX_EMAIL_ATTEMPTS) {
				const verificationToken = randomBytes(32).toString('hex');
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

				// rate-limit должен быть привязан к тому, кто пытается отправить,
				// а не пользователю в бд. Поэтому ошибку о превышении числа лимитов
				// нужно кидать глобально, а тут просто игнорить

				this.sendEmailToken(user.email, user.name, verificationToken);
			}
		}
		return {
			message:
				'If the account exists and has not been verified, a new link has been sent.',
		};
	}

	private sendEmailToken(email: string, name: string, token: string): void {
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

	async loginOrRegisterWithGoogle(user: GoogleUser): Promise<AuthResponse> {
		let existingUser = await this.prismaService.user.findUnique({
			where: { googleId: user.googleId },
		});

		if (existingUser) {
			// Сценарий А: Пользователь уже входил через Google. Просто логиним.
			return this.generateTokens(existingUser.id);
		}

		// 2. Ищем пользователя по email (вдруг он уже регистрировался через пароль)
		existingUser = await this.prismaService.user.findUnique({
			where: { email: user.email },
		});

		if (existingUser) {
			// Сценарий Б: Аккаунт есть, привязываем к нему Google ID.
			// И сразу помечаем как verified, так как Google уже подтвердил почту.
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

		// 3. Сценарий В: Пользователь новый. Создаем его.
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

	private async sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(() => resolve(), ms));
	}

	async generate2FACode(id: number) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const secret = generateSecret();

		const otpauthUrl = generateURI({
			strategy: 'totp',
			issuer: 'Nest-auth app',
			secret,
			label: user.email,
		});

		const qrCodeDataURL = await toDataURL(otpauthUrl);

		await this.prismaService.user.update({
			where: { email: user.email },
			data: {
				twoFactorSecret: secret,
			},
		});
		return { secret, qrCodeDataURL };
	}

	async enable2FA(id: number, code: string) {
		const user = await this.prismaService.user.findUnique({ where: { id } });

		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (!user.twoFactorSecret) {
			throw new BadRequestException('Firstly generate a secret');
		}

		const isVerified = await otpVerify({
			secret: user.twoFactorSecret,
			token: code,
		});

		if (!isVerified) {
			throw new BadRequestException('Invalid code');
		}

		await this.prismaService.user.update({
			where: { id },
			data: { isTwoFactorEnabled: true },
		});
	}

	async verify2FALogin(tempToken: string, code: string): Promise<AuthResponse> {
		try {
			const payload = this.jwtService.verify<JwtPayload>(tempToken);

			if (payload.type !== '2fa' || !payload.id) {
				throw new BadRequestException('Invalid token');
			}

			const user = await this.prismaService.user.findUnique({
				where: { id: payload.id },
			});

			if (!user || !user.twoFactorSecret) {
				throw new UnauthorizedException('2FA not enabled');
			}

			const isVerified = await otpVerify({
				token: code,
				secret: user.twoFactorSecret,
			});

			if (!isVerified) {
				throw new UnauthorizedException('Invalid 2FA code');
			}

			return this.generateTokens(user.id);
		} catch {
			throw new UnauthorizedException('Invalid or expired 2FA session');
		}
	}
}
