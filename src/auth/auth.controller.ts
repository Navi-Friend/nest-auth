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
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
	OmitType,
} from '@nestjs/swagger';
import { LoginRequest } from './dto/request/login.dto';
import { AuthCookieInterceptor } from './interceptors/cookie.interceptor';
import { Cookies } from '../common/decorators/cookie.decorator';
import { type Request, type Response } from 'express';
import { AuthResponse } from './dto/response/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailRequest } from './dto/request/email.dto';

@ApiTags('Auth')
@UseInterceptors(AuthCookieInterceptor)
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
	@ApiNotFoundResponse({ description: 'Email is not verified' })
	@ApiBadRequestResponse({ description: 'Incorrect input data' })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginRequest) {
		return await this.authService.login(dto);
	}

	@ApiOperation({
		summary: 'Refresh tokens',
		description:
			'Returns accessToken in body and refresh in cookie. Requires refreshToken',
	})
	@ApiOkResponse({ type: OmitType(AuthResponse, ['refreshToken']) })
	@ApiNotFoundResponse({
		description:
			'Sent if user with email is not found or password is incorrect',
	})
	@ApiUnauthorizedResponse({ description: 'Refresh token is not valid ' })
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
	@UseGuards(JwtAuthGuard)
	@Get('me')
	@HttpCode(HttpStatus.OK)
	me(@Req() req: Request) {
		return req.user;
	}

	@ApiOperation({
		summary: 'Verify email',
		description: 'If token is valid, send access and refresh tokens',
	})
	@ApiOkResponse()
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
	@ApiOkResponse()
	@ApiBadRequestResponse({ description: 'Incorrect email' })
	@Post('resend-email')
	@HttpCode(HttpStatus.OK)
	async resendEmail(@Body() dto: EmailRequest) {
		return await this.authService.resendEmail(dto.email);
	}
}
