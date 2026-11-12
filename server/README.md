# Expense Tracker API

TypeScript API using Express 5, Prisma ORM 7, and PostgreSQL.

This package is part of the repository's `apps/*` npm workspace. Install dependencies from the
repository root.

## Local development

```sh
cd ../..
npm install
cp apps/server/.env.example apps/server/.env
docker compose --file apps/server/compose.yaml up -d
npm --workspace=apps/server run db:migrate
npm run dev
```

The server listens on port `3000` by default. PostgreSQL is exposed only on localhost port `5433`.

## Commands

```sh
npm run dev          # Start with file watching
npm run build        # Generate Prisma Client and compile TypeScript
npm start            # Run the compiled server
npm run typecheck    # Generate Prisma Client and check types
npm run db:migrate   # Create/apply development migrations
npm run db:studio    # Open Prisma Studio
```

For production, set `NODE_ENV=production`, provide a secure `DATABASE_URL`, run
`npx prisma migrate deploy`, build, and then run `npm start`.

## Endpoints

| Method | Path               | Purpose                              |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/`                | API metadata                         |
| GET    | `/health`          | Express liveness check               |
| GET    | `/health/database` | PostgreSQL readiness check via Prisma |
