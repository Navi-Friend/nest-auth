import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../generated/prisma/client';

export const CurrentUser = createParamDecorator(
	(key: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
		const user = request.user;

		return key ? user?.[key] : user;
	},
);
