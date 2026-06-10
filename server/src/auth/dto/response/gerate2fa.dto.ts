import { ApiProperty } from '@nestjs/swagger';

export class Generate2FAResponseDto {
	@ApiProperty({
		description: 'Base32 секретный ключ для добавления в Google Authenticator',
		example: 'JBSWY3DPEHPK3PXP',
	})
	secret: string;

	@ApiProperty({
		description: 'Data URL изображения QR-кода для сканирования',
		example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
	})
	otpAuthUrl: string;
}
