"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
const common_1 = require("@nestjs/common");
exports.Cookies = (0, common_1.createParamDecorator)((field, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return field ? req.cookies?.[field] : req.cookies;
});
//# sourceMappingURL=cookie.decorator.js.map