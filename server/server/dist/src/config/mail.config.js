"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailConfig = getMailConfig;
function getMailConfig(configService) {
    return {
        transport: {
            host: configService.getOrThrow('MAIL_HOST'),
            port: configService.getOrThrow('MAIL_PORT'),
            secure: true,
            auth: {
                user: configService.get('MAIL_USER'),
                pass: configService.get('MAIL_PASSWORD'),
            },
        },
        defaults: {
            from: `"No Reply" <${configService.getOrThrow('MAIL_USER')}>`,
        },
    };
}
//# sourceMappingURL=mail.config.js.map