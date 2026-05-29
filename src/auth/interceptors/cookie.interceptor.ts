import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { isDev } from '../../utils/isDev.util';
import { AuthResponse } from '../dto/response/auth.dto';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
	constructor(private readonly configService: ConfigService) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		return next.handle().pipe(
			map((data: AuthResponse) => {
				const response = context.switchToHttp().getResponse<Response>();

				if (data?.refreshToken) {
					const cookieDomain =
						this.configService.getOrThrow<string>('COOKIE_DOMAIN');

					response.cookie('refreshToken', data.refreshToken, {
						httpOnly: true,
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
						secure: !isDev(this.configService),
						domain: cookieDomain,
						sameSite: isDev(this.configService) ? 'lax' : 'none',
					});

					const { refreshToken, ...rest } = data;
					return rest;
				}
				return data;
			}),
		);
	}
}
