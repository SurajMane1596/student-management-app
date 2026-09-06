# Student Management — Backend

Production-ready REST API for the Student Management application, backed
by **Neon PostgreSQL** via **Prisma**. Endpoints match the frontend's
`src/api/*Api.js` layer exactly, so pointing the frontend's
`VITE_API_BASE_URL` at a running instance of this server is the only
change needed to go from mock data to real data.

## Tech Stack

- **Express** — HTTP server
- **Prisma** — schema, migrations, type-safe queries against Postgres
- **Neon PostgreSQL** — serverless Postgres (pooled connection for the app, direct connection for migrations)
- **JWT** (`jsonwebtoken`) — stateless auth; **argon2** for password hashing
- **Zod** — request validation, mirroring the frontend's field rules exactly
- **helmet**, **cors**, **express-rate-limit** — baseline security
- **pino** / **pino-http** — structured, redacted logging

## 1. Create the Neon database

1. Sign up / log in at [neon.tech](https://neon.tech) and create a new project.
2. In the Neon console, open your project's **Connection Details**.
3. Copy the **Pooled connection** string (it includes `-pooler` in the
   hostname) → this is `DATABASE_URL`.
4. Copy the **Direct connection** string (no `-pooler`) → this is
   `DIRECT_URL`.
5. Both must include `?sslmode=require` — Neon enforces SSL.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `DATABASE_URL`, `DIRECT_URL`, and generate a `JWT_SECRET`:

```bash
openssl rand -base64 48
```

## 3. Install, migrate, seed

```bash
npm install                    # also runs `prisma generate` (postinstall)
npm run prisma:migrate:dev     # creates tables in your Neon database
npm run seed                   # inserts a demo user + one sample student
```

Demo login after seeding — Client Id `DEMO0001`, Mobile `9619306969`,
Password `Demo@123`.

## 4. Run the server

```bash
npm run dev      # auto-restarts on file changes (node --watch)
npm start        # production mode
```

The server listens on `PORT` (default `4000`). Confirm it's up:

```bash
curl http://localhost:4000/api/health
```

## API Endpoints

| Method | Path                  | Auth | Description |
|--------|-----------------------|------|-------------|
| POST   | `/api/auth/login`     | No   | Returns `{ ok, token, user }` |
| GET    | `/api/profile`        | Yes  | Current user's profile |
| PUT    | `/api/profile`        | Yes  | Update profile fields |
| GET    | `/api/customers`      | Yes  | Paginated list (`?page`, `?pageSize`) |
| GET    | `/api/customers/:id`  | Yes  | Single student record |
| POST   | `/api/customers`      | Yes  | Create a student |
| PUT    | `/api/customers/:id`  | Yes  | Update a student |
| DELETE | `/api/customers/:id`  | Yes  | Delete a student |
| GET    | `/api/health`         | No   | Liveness + DB connectivity check |

Protected routes require `Authorization: Bearer <token>`. Every response
is shaped `{ ok: boolean, ... }`; failures include `{ ok: false, error,
details? }`, where `details` (on 422s) is a list of `{ path, message }`
per invalid field.

## Project Structure

```
backend/
  prisma/
    schema.prisma     Data model (users, students, student_school_days, lookup tables)
    seed.js            Local dev seed script
  src/
    config/env.js       Centralized env var loading + validation
    lib/prisma.js        Prisma client singleton (long-lived, pooled)
    middleware/
      auth.js             JWT verification + signing
      validate.js          Zod request validation middleware
      errorHandler.js       Centralized error shaping + AppError class
      rateLimiter.js         Auth + general API rate limits
    validation/          Zod schemas mirroring the frontend's field rules
    services/            Business logic + Prisma queries
    controllers/         Thin HTTP layer calling services
    routes/               Route wiring
    app.js                 Express app assembly (middleware + routes)
    server.js               Entrypoint; graceful shutdown on SIGTERM/SIGINT
```

## Design Notes

- **Why a pooled vs. direct URL?** Neon's pooled endpoint (PgBouncer)
  handles many short-lived connections efficiently, which is what a
  running Express server does under load. Prisma Migrate needs a direct
  connection because some migration operations aren't compatible with a
  transaction pooler.
- **Why lookup tables for city/district/state but enums for gender/blood
  group/school days?** The former are expected to grow (more cities,
  business expanding to new districts/states) without a deploy; the
  latter are closed sets unlikely to ever change, where an enum's
  type-safety and speed win.
- **Blood group representation**: the frontend uses `"A+"`, `"B-"`, etc.
  Postgres enum labels can't contain `+`/`-`, so the DB stores `A_POS`,
  `B_NEG`, etc. The translation happens in exactly one place —
  `src/validation/customerSchemas.js`'s `BLOOD_GROUP_TO_DB` /
  `_FROM_DB` maps — so it never leaks into any other file.
- **Server-side validation duplicates the frontend's rules on purpose.**
  Never trust client-side validation alone; a malicious or buggy client
  could send anything. Both schemas are derived from the same
  requirement document and should be updated together if a rule changes.
- **Password never leaves the User row.** `toPublicUser()` in
  `profile.service.js` is the only place a `User` record is turned into
  an API response, and it never includes `passwordHash`.

## Production-Readiness Checklist

- [x] Environment-based config, `.env` never committed (`.gitignore`)
- [x] Centralized error handler, consistent `{ ok, error }` JSON shape
- [x] Server-side validation on every mutating endpoint
- [x] Pooled connection for runtime, direct connection reserved for migrations
- [x] Health check endpoint for uptime monitoring
- [x] CORS restricted to `CORS_ORIGIN` (comma-separated allow-list)
- [x] Rate limiting (stricter on `/auth/login`, general limit elsewhere)
- [x] Structured, redacted logs (passwords/tokens never logged)
- [x] Graceful shutdown (drains in-flight requests, closes Prisma's pool)
- [x] Seed script for local development

## Deployment

This Express app is a normal long-running Node process, so it deploys
cleanly to any of **Render**, **Railway**, or **Fly.io**. Steps are the
same shape on all three:

1. Push this repo (or the `backend/` folder as its own repo) to GitHub.
2. Create a new Web Service, pointing it at the repo, with:
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `backend` (if kept in the monorepo)
3. Add the environment variables from `.env.example` (`DATABASE_URL`,
   `DIRECT_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`) in the platform's
   dashboard — never commit real values.
4. Run migrations as a **release/deploy step**, not `db push`:
   `npm run prisma:migrate:deploy`. Render and Railway both support a
   "pre-deploy" or "release" command for exactly this; Fly.io supports it
   via a `release_command` in `fly.toml`.
5. Point the frontend's `VITE_API_BASE_URL` at the deployed URL (e.g.
   `https://your-service.onrender.com/api`) and set `CORS_ORIGIN` on the
   backend to the frontend's deployed origin.

## A note on local verification

This backend was built and code-reviewed in a sandboxed environment
without general internet access, so `prisma generate` / `prisma migrate`
could not be executed against Prisma's own engine binaries here (they're
fetched from `binaries.prisma.sh`, which wasn't reachable). To compensate:

- The schema was hand-translated to raw SQL and applied to a real local
  PostgreSQL instance, confirming every table, enum, foreign key, index,
  and cascading delete is valid.
- Every route, middleware, and service was smoke-tested end-to-end
  (login, JWT issuance/verification, validation success/failure paths,
  full customer CRUD, pagination, 404/401/422 handling) using the real
  Express app wired to an in-memory stand-in for the Prisma client.

Running `npm install && npm run prisma:migrate:dev` in a normal
environment (your machine or CI) exercises the real Prisma engine and is
expected to work without changes — but do run it once yourself and
confirm before deploying, as you would with any new codebase.
