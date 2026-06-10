import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class LoginRequest {
	@ApiProperty({ example: 'admin@gmail.com' })
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Incorrect email address' })
	email: string;

	@ApiProperty({ example: '123njkljbASf', minLength: 6, maxLength: 128 })
	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password is required' })
	@MinLength(6)
	@MaxLength(128)
	password: string;
}
