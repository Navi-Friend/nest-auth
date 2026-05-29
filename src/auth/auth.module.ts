import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/jwt.config';
import { AuthCookieInterceptor } from './interceptors/cookie.interceptor';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AuthCookieInterceptor, JwtAuthGuard],
})
export class AuthModule {}
