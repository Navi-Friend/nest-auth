import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleUser } from '../interfaces/google-user.interface';
import { GoogleProfile } from '../interfaces/google-profile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
			clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
			callbackURL: configService.getOrThrow('GOOGLE_CALLBACK_URL'),
			scope: ['email', 'profile'],
		});
	}

	validate(
		accessToken: string,
		refreshToken: string,
		profile: GoogleProfile,
		done: VerifyCallback,
	) {
		const { displayName, emails, id } = profile;

		const user: GoogleUser = {
			googleId: id,
			email: emails[0].value,
			name: displayName,
			accessToken,
			refreshToken,
		};

		done(null, user);
	}
}
