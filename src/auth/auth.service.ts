import {
	ConflictException,
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
import { LoginRequest } from './dto/request/login.dto';
import { AuthResponse } from './dto/response/auth.dto';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
	private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_ACCESS_TOKEN_TTL',
		) as JwtSignOptions['expiresIn'];
		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_REFRESH_TOKEN_TTL',
		) as JwtSignOptions['expiresIn'];
	}

	async register(dto: RegisterRequest): Promise<AuthResponse> {
		const { name, email, password } = dto;

		const existing = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (existing) {
			throw new ConflictException('User with this email already exists');
		}

		const user = await this.prismaService.user.create({
			data: {
				email,
				name,
				password: await hash(password),
			},
		});

		return this.generateTokens(user.id);
	}

	async login(dto: LoginRequest): Promise<AuthResponse> {
		const { email, password } = dto;

		const user = await this.prismaService.user.findUnique({
			where: { email },
			select: { id: true, password: true },
		});

		if (!user) {
			throw new NotFoundException('Incorrect email or password');
		}

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword) {
			throw new NotFoundException('Incorrect email or password');
		}

		return this.generateTokens(user.id);
	}

	private generateTokens(id: number) {
		const payload: JwtPayload = { id };

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL,
		});

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL,
		});

		return { accessToken, refreshToken };
	}

	async refresh(refreshToken: string) {
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
}
