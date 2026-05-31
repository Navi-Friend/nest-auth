import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<number>('MAIL_PORT'),
			secure: true,
			auth: {
				user: configService.get<string>('MAIL_USER'),
				pass: configService.get<string>('MAIL_PASSWORD'),
			},
		},
		defaults: {
			from: `"No Reply" <${configService.getOrThrow<string>('MAIL_USER')}>`,
		},
	};
}
