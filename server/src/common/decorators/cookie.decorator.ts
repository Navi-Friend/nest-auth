import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
	(field: string, ctx: ExecutionContext): string | Record<string, any> => {
		const req = ctx.switchToHttp().getRequest<Request>();

		return field ? (req.cookies?.[field] as string) : req.cookies;
	},
);
