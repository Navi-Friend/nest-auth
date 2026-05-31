import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailConfig } from './config/mail.config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMailConfig,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
