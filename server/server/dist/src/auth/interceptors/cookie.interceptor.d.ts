import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable } from 'rxjs';
export declare class AuthCookieInterceptor implements NestInterceptor {
    private readonly configService;
    constructor(configService: ConfigService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
export declare function setRefreshToCookie(response: Response, refreshToken: string, configService: ConfigService): void;
