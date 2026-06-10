"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCookieInterceptor = void 0;
exports.setRefreshToCookie = setRefreshToCookie;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const isDev_util_1 = require("../../utils/isDev.util");
let AuthCookieInterceptor = class AuthCookieInterceptor {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const response = context.switchToHttp().getResponse();
            if (data?.refreshToken) {
                setRefreshToCookie(response, data.refreshToken, this.configService);
                const { refreshToken, ...rest } = data;
                return rest;
            }
            return data;
        }));
    }
};
exports.AuthCookieInterceptor = AuthCookieInterceptor;
exports.AuthCookieInterceptor = AuthCookieInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthCookieInterceptor);
function setRefreshToCookie(response, refreshToken, configService) {
    const cookieDomain = configService.getOrThrow('COOKIE_DOMAIN');
    response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: !(0, isDev_util_1.isDev)(configService),
        domain: cookieDomain,
        sameSite: (0, isDev_util_1.isDev)(configService) ? 'lax' : 'none',
    });
}
//# sourceMappingURL=cookie.interceptor.js.map