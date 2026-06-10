import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class Enable2FADto {
	@ApiProperty({
		description: '6-значный TOTP код из приложения аутентификации',
		example: '123456',
	})
	@IsString()
	@Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
	code: string;
}
