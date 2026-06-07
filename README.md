# Auth Project

Small NestJS authentication API with email/password login, JWT access and refresh tokens, email verification, and Google OAuth.

## Overview

The project is built with:

- NestJS
- Prisma + PostgreSQL
- Passport strategies for `local`, `jwt`, and Google OAuth
- JWT access tokens in the `Authorization` header
- Refresh tokens stored in an HTTP-only cookie
- Swagger documentation at `/docs`

Main auth flows:

- register a user and send an email verification link
- log in with email/password
- refresh tokens using the refresh cookie
- protect routes with a JWT guard
- log in with Google OAuth

## Setup

Install dependencies:

```bash
npm install
```

Make sure your environment variables are configured before running the app. The project expects same variables as in `.env.example`

If you use email verification, also configure the mailer variables required by your local `.env`.

## Run

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

## Database

Generate Prisma client and apply your migration workflow as needed before starting the app.

If you want to inspect the database visually:

```bash
npx prisma studio
```

## Swagger

After the app starts, open:

```text
/docs
```

Swagger includes bearer auth for protected routes and refresh-cookie auth for token rotation.

## Complex Parts

### Passport flow

Passport is used as a strategy layer, not as a full auth system. Each strategy handles one job:

- `local` validates email and password during login
- `jwt` validates access tokens for protected routes
- Google strategy handles OAuth callback data and converts it into a user object

The controller stays thin: it receives `req.user` from Passport and passes the user id to the service.

### Refresh token handling

Refresh tokens are stored in an HTTP-only cookie instead of the response body. This reduces exposure in the browser and lets the API rotate tokens during refresh.

### Google OAuth

Google login is split into two routes:

- `/auth/google` starts the OAuth redirect
- `/auth/google/callback` receives the Google profile, finds or creates a user, then issues JWT tokens

### Email verification

After registration, the user receives a verification token by email. Until the account is verified, the password login flow rejects access.

## Useful Scripts

- `npm run start:dev` - run the API in watch mode
- `npm run build` - compile the project
- `npm run lint` - run ESLint
- `npm run test` - run unit tests
- `npm run test:e2e` - run end-to-end tests

## Notes

- Swagger is the best place to explore the API surface.
- Protected endpoints expect a bearer access token.
- Refresh tokens are read from cookies, not from the request body.
