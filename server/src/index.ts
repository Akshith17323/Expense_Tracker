import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const server = createServer(app);

server.listen(env.PORT, env.HOST, () => {
  console.log(`Expense Tracker API listening at http://${env.HOST}:${env.PORT}`);
});

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  server.close((serverError) => {
    void prisma
      .$disconnect()
      .then(() => {
        clearTimeout(forceExitTimer);
        process.exit(serverError ? 1 : 0);
      })
      .catch((databaseError: unknown) => {
        console.error("Failed to disconnect from PostgreSQL:", databaseError);
        process.exit(1);
      });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
