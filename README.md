# Expense Tracker

The project contains:

- A basic Expo + React Native mobile app with a typed React Navigation native stack.
- A TypeScript API built with Express, Prisma ORM, and PostgreSQL.

## Start the mobile app

Install dependencies from the project root, then start Expo:

```sh
npm install
npm run dev:mobile
```

Scan the QR code with Expo Go, or press `a` for Android, `i` for iOS, or `w` for web.
The starter navigation stack contains a Home screen and an Add Expense screen.

## Start the server

```sh
npm install
cp server/.env.example server/.env
docker compose --file server/compose.yaml up -d
npm run db:migrate --workspace server
npm run dev:server
```

The API starts at `http://localhost:3000`.

- `GET /health` checks the Express process.
- `GET /health/database` checks the PostgreSQL connection through Prisma.

See [`server/README.md`](server/README.md) for configuration and production commands.
