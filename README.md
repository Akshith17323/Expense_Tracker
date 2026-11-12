# Expense Tracker

The project currently contains a TypeScript API built with Express, Prisma ORM, and PostgreSQL.

## Start the server

```sh
npm install
cp apps/server/.env.example apps/server/.env
docker compose --file apps/server/compose.yaml up -d
npm --workspace=apps/server run db:migrate
npm run dev
```

The API starts at `http://localhost:3000`.

- `GET /health` checks the Express process.
- `GET /health/database` checks the PostgreSQL connection through Prisma.

See [`apps/server/README.md`](apps/server/README.md) for configuration and production commands.
