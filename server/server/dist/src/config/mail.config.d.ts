import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare function getMailConfig(configService: ConfigService): MailerOptions;
