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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/request/register.dto");
const swagger_1 = require("@nestjs/swagger");
const cookie_interceptor_1 = require("./interceptors/cookie.interceptor");
const cookie_decorator_1 = require("../common/decorators/cookie.decorator");
const auth_dto_1 = require("./dto/response/auth.dto");
const email_dto_1 = require("./dto/request/email.dto");
const authorization_decorator_1 = require("./decorators/authorization.decorator");
const login_dto_1 = require("./dto/request/login.dto");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const user_decorator_1 = require("./decorators/user.decorator");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async register(dto) {
        return await this.authService.register(dto);
    }
    login(dto, id) {
        return this.authService.login(id);
    }
    async refresh(refreshToken) {
        return await this.authService.refresh(refreshToken);
    }
    logout(res) {
        res.clearCookie('refreshToken');
        res.json();
    }
    me(user) {
        return user;
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.BadRequestException('Token is not sent');
        }
        return await this.authService.verifyEmail(token);
    }
    async resendEmail(dto) {
        return await this.authService.resendEmail(dto.email);
    }
    async googleAouth() { }
    async googleAuthRedirect(req, res) {
        const user = req.user;
        const tokens = await this.authService.loginOrRegisterWithGoogle(user);
        (0, cookie_interceptor_1.setRefreshToCookie)(res, tokens.refreshToken, this.configService);
        const frontendUrl = this.configService.getOrThrow('FRONTEND_URL');
        res.redirect(`${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}`);
    }
    async generate2FACode(id) {
        return await this.authService.generate2FACode(id);
    }
    async enable2FA(id, code) {
        return await this.authService.enable2FA(id, code);
    }
    async verify2FA(tempToken, code) {
        return await this.authService.verify2FALogin(tempToken, code);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Register user',
        description: 'Send confirmation email',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User successfully created' },
            },
        },
    }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Sent if user already exists' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Incorrect input data' }),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
        description: 'Returns accessToken in body and refresh in cookie',
    }),
    (0, swagger_1.ApiOkResponse)({ type: (0, swagger_1.OmitType)(auth_dto_1.AuthResponse, ['refreshToken']) }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Sent if user with email is not found or password is incorrect',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Incorrect input data' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Email is not verified' }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginRequest, Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh tokens',
        description: 'Returns accessToken in body and refresh in cookie. Requires refreshToken',
    }),
    (0, swagger_1.ApiOkResponse)({ type: (0, swagger_1.OmitType)(auth_dto_1.AuthResponse, ['refreshToken']) }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Sent if user from refresh token is not found',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Refresh token is not valid ' }),
    (0, swagger_1.ApiCookieAuth)('refreshToken'),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, cookie_decorator_1.Cookies)('refreshToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Logout uesr',
        description: 'Removes access and refresh tokens',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Protected route',
        description: 'Requires access token',
    }),
    (0, swagger_1.ApiOkResponse)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, authorization_decorator_1.Authorization)(),
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email',
        description: 'If token is valid, send access and refresh tokens',
    }),
    (0, swagger_1.ApiOkResponse)({ type: (0, swagger_1.OmitType)(auth_dto_1.AuthResponse, ['refreshToken']) }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Link is invalid or expired',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Token is not sent',
    }),
    (0, common_1.Get)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Resent email token',
        description: 'If user with token is found, send token. 3 resends per hour available',
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'If the account exists and has not been verified, a new link has been sent.',
                },
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Incorrect email' }),
    (0, common_1.Post)('resend-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.EmailRequest]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Start Google OAuth',
        description: 'Redirects the user to the Google consent screen',
    }),
    (0, swagger_1.ApiFoundResponse)({ description: 'Redirects to Google OAuth consent screen' }),
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAouth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Google OAuth callback',
        description: 'Exchanges Google profile data for access and refresh tokens',
    }),
    (0, swagger_1.ApiOkResponse)({ type: (0, swagger_1.OmitType)(auth_dto_1.AuthResponse, ['refreshToken']) }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Google authentication failed' }),
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, authorization_decorator_1.Authorization)(),
    (0, common_1.Get)('2fa/generate'),
    __param(0, (0, user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate2FACode", null);
__decorate([
    (0, authorization_decorator_1.Authorization)(),
    (0, common_1.Post)('2fa/generate'),
    __param(0, (0, user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enable2FA", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    __param(0, (0, common_1.Body)('tempToken')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FA", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.UseInterceptors)(cookie_interceptor_1.AuthCookieInterceptor),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map