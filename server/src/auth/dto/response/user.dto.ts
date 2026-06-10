import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../generated/prisma/client';

export class UserResponse implements Partial<User> {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	isTwoFactorEnabled: boolean;

	@ApiProperty()
	isVerified: boolean;
}
