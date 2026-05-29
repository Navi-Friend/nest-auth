import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
	const swagger = new DocumentBuilder()
		.setTitle('Nest auth api')
		.setDescription('API documentation for Nest authorization app')
		.setVersion('1.0.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swagger);

	SwaggerModule.setup('/docs', app, document, {
		jsonDocumentUrl: '/swagger.json',
		yamlDocumentUrl: '/swagger.yaml',
		customSiteTitle: 'Nestjs Auth Docs',
	});
}
