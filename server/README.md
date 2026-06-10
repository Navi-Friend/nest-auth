# Auth Project

This repository is split into a NestJS server and a React client.

## Structure

- `src/` - NestJS auth API
- `client/` - React frontend for the auth flows
- `prisma/` - Prisma schema and migrations for the server

## Server

The server is the existing NestJS authentication API with:

- email/password login and registration
- JWT access tokens in the `Authorization` header
- refresh tokens in an HTTP-only cookie
- email verification and Google OAuth
- Swagger docs at `/docs`

Run it from the repository root:

```bash
npm install
npm run start:dev
```

## Client

The new React client lives in `client/` and talks to the API through the auth endpoints under `/auth`.

Run it in a separate terminal:

```bash
cd client
npm install
npm run dev
```

The client expects the API at `http://127.0.0.1:3000` by default. If you change that, update `client/.env` or `client/.env.local` with `VITE_API_URL`.

## Setup

Copy the environment variables from `.env.example` and make sure your database and mail settings are configured before starting the server.

## Swagger

After the server starts, open:

```text
/docs
```

Swagger includes bearer auth for protected routes and refresh-cookie auth for token rotation.

## Useful Scripts

Server:

- `npm run start:dev` - run the API in watch mode
- `npm run build` - compile the server
- `npm run lint` - run ESLint
- `npm run test` - run unit tests
- `npm run test:e2e` - run end-to-end tests

Client:

- `npm run dev` - start the React app from `client/`
- `npm run build` - build the React app from `client/`
