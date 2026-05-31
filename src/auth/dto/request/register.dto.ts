import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class RegisterRequest {
	@ApiProperty({ example: 'Ivan', maxLength: 50 })
	@IsString({ message: 'Name must be a string' })
	@IsNotEmpty({ message: 'Name is required' })
	@MaxLength(50, { message: "Name shouldn't be more than 50 chars" })
	name: string;

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
