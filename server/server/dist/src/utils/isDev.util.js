"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
const isDev = (configService) => {
    return configService.getOrThrow('NODE_ENV') === 'development';
};
exports.isDev = isDev;
//# sourceMappingURL=isDev.util.js.map