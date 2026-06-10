import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class Verify2FADto {
	@ApiProperty({
		description: 'Временный JWT-токен, полученный после успешного ввода пароля',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	tempToken: string;

	@ApiProperty({
		description: '6-значный TOTP код из приложения аутентификации',
		example: '654321',
	})
	@IsString()
	@Length(6, 6, { message: 'Код должен состоять из 6 цифр' })
	code: string;
}
