import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
	@ApiProperty({
		description: 'JWT access token',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMDUwMDE5LCJleHAiOjE3ODAwNTcyMTl9.FhOgdXt6X22CPQPR-R41NMgLMAsjlk1hQh2-bDMDls4',
	})
	accessToken: string;

	@ApiProperty({
		description: 'JWT refresh token',
		example:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzgwMDUwMDE5LCJleHAiOjE3ODAwNTcyMTl9.FhOgdXt6X22CPQPR-R41NMgLMAsjlk1hQh2-bDMDls4',
	})
	refreshToken: string;
}
