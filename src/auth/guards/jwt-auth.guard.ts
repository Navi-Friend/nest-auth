import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		try {
			const accessToken = req.headers['authorization']?.split(
				' ',
			)?.[1] as string;

			const payload: JwtPayload =
				await this.jwtService.verifyAsync(accessToken);

			req['user'] = { id: payload.id };
			return true;
		} catch {
			throw new UnauthorizedException();
		}
	}
}
