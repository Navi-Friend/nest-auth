import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/request/register.dto';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiCookieAuth,
	ApiFoundResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	OmitType,
} from '@nestjs/swagger';
import {
	AuthCookieInterceptor,
	setRefreshToCookie,
} from './interceptors/cookie.interceptor';
import { Cookies } from '../common/decorators/cookie.decorator';
import { type Request, type Response } from 'express';
import { AuthResponse } from './dto/response/auth.dto';
import { EmailRequest } from './dto/request/email.dto';
import { Authorization } from './decorators/authorization.decorator';
import { LoginRequest } from './dto/request/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleUser } from './interfaces/google-user.interface';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from './decorators/user.decorator';
import type { User } from '../generated/prisma/client';

@ApiTags('Auth')
@UseInterceptors(AuthCookieInterceptor)
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@ApiOperation({
		summary: 'Register user',
		description: 'Send confirmation email',
	})
	@ApiCreatedResponse({
		schema: {
			type: 'object',
			properties: {
				message: { type: 'string', example: 'User successfully created' },
			},
		},
	})
	@ApiConflictResponse({ description: 'Sent if user already exists' })
	@ApiBadRequestResponse({ description: 'Incorrect input data' })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterRequest) {
		return await this.authService.register(dto);
	}

	@ApiOperation({
		summary: 'Login user',
		description: 'Returns accessToken in body and refresh in cookie',
	})
	@ApiOkResponse({ type: OmitType(AuthResponse, ['refreshToken']) })
	@ApiNotFoundResponse({
		description:
			'Sent if user with email is not found or password is incorrect',
	})
	@ApiBadRequestResponse({ description: 'Incorrect input data' })
	@ApiForbiddenResponse({ description: 'Email is not verified' })
	@UseGuards(AuthGuard('local'))
	@Post('login')
	@HttpCode(HttpStatus.OK)
	login(@Body() dto: LoginRequest, @CurrentUser('id') id: number) {
		return this.authService.login(id);
	}

	@ApiOperation({
		summary: 'Refresh tokens',
		description:
			'Returns accessToken in body and refresh in cookie. Requires refreshToken',
	})
	@ApiOkResponse({ type: OmitType(AuthResponse, ['refreshToken']) })
	@ApiNotFoundResponse({
		description: 'Sent if user from refresh token is not found',
	})
	@ApiUnauthorizedResponse({ description: 'Refresh token is not valid ' })
	@ApiCookieAuth('refreshToken')
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Cookies('refreshToken') refreshToken: string | null) {
		return await this.authService.refresh(refreshToken);
	}

	@ApiOperation({
		summary: 'Logout uesr',
		description: 'Removes access and refresh tokens',
	})
	@ApiOkResponse()
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('refreshToken');
		res.json();
	}

	@ApiOperation({
		summary: 'Protected route',
		description: 'Requires access token',
	})
	@ApiOkResponse()
	@ApiBearerAuth()
	@Authorization()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	me(@CurrentUser() user: User) {
		return user;
	}

	@ApiOperation({
		summary: 'Verify email',
		description: 'If token is valid, send access and refresh tokens',
	})
	@ApiOkResponse({ type: OmitType(AuthResponse, ['refreshToken']) })
	@ApiBadRequestResponse({
		description: 'Link is invalid or expired',
	})
	@ApiBadRequestResponse({
		description: 'Token is not sent',
	})
	@Get('verify-email')
	@HttpCode(HttpStatus.OK)
	async verifyEmail(@Query('token') token: string | null) {
		if (!token) {
			throw new BadRequestException('Token is not sent');
		}

		return await this.authService.verifyEmail(token);
	}

	@ApiOperation({
		summary: 'Resent email token',
		description:
			'If user with token is found, send token. 3 resends per hour available',
	})
	@ApiOkResponse({
		schema: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					example:
						'If the account exists and has not been verified, a new link has been sent.',
				},
			},
		},
	})
	@ApiBadRequestResponse({ description: 'Incorrect email' })
	@Post('resend-email')
	@HttpCode(HttpStatus.OK)
	async resendEmail(@Body() dto: EmailRequest) {
		return await this.authService.resendEmail(dto.email);
	}

	@ApiOperation({
		summary: 'Start Google OAuth',
		description: 'Redirects the user to the Google consent screen',
	})
	@ApiFoundResponse({ description: 'Redirects to Google OAuth consent screen' })
	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAouth() {}

	@ApiOperation({
		summary: 'Google OAuth callback',
		description: 'Exchanges Google profile data for access and refresh tokens',
	})
	@ApiOkResponse({ type: OmitType(AuthResponse, ['refreshToken']) })
	@ApiUnauthorizedResponse({ description: 'Google authentication failed' })
	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const user = req.user as GoogleUser;

		const tokens = await this.authService.loginOrRegisterWithGoogle(user);
		setRefreshToCookie(res, tokens.refreshToken, this.configService);

		const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');

		res.redirect(
			`${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}`,
		);
	}

	@Authorization()
	@Get('2fa/generate')
	async generate2FACode(@CurrentUser('id') id: number) {
		return await this.authService.generate2FACode(id);
	}

	@Authorization()
	@Post('2fa/generate')
	async enable2FA(@CurrentUser('id') id: number, @Body('code') code: string) {
		return await this.authService.enable2FA(id, code);
	}

	@Post('2fa/verify')
	async verify2FA(
		@Body('tempToken') tempToken: string,
		@Body('code') code: string,
	) {
		return await this.authService.verify2FALogin(tempToken, code);
	}
}
