import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenvExpand from 'dotenv-expand';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const env = config();
	dotenvExpand.expand(env);

	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe());

	const swagger = new DocumentBuilder()
		.setTitle('Nest auth api')
		.setDescription('API documentation for Nest authorization')
		.build();

	const document = SwaggerModule.createDocument(app, swagger);

	SwaggerModule.setup('/docs', app, document, {
		jsonDocumentUrl: '/swagger.json',
		yamlDocumentUrl: '/swagger.yaml',
		customSiteTitle: 'Nestjs Auth Docs',
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
