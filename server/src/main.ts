import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as dotenvExpand from 'dotenv-expand';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './utils/swagger.util';

async function bootstrap() {
	const env = config();
	dotenvExpand.expand(env);

	const app = await NestFactory.create(AppModule);
	const frontendUrl = process.env.FRONTEND_URL ?? 'http://127.0.0.1:5173';

	app.enableCors({
		origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
		credentials: true,
	});

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	// Чтобы использовать class-transformer в response автоматически
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	setupSwagger(app);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
