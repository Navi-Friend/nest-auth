"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const swagger = new swagger_1.DocumentBuilder()
        .setTitle('Nest auth api')
        .setDescription('API documentation for Nest authorization app')
        .setVersion('1.0.1')
        .addBearerAuth()
        .addCookieAuth('refreshToken')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swagger);
    swagger_1.SwaggerModule.setup('/docs', app, document, {
        jsonDocumentUrl: '/swagger.json',
        yamlDocumentUrl: '/swagger.yaml',
        customSiteTitle: 'Nestjs Auth Docs',
    });
}
//# sourceMappingURL=swagger.util.js.map