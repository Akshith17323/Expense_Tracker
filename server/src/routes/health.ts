import { Router } from "express";
import { HttpError } from "../errors/http-error.js";
import { prisma } from "../lib/prisma.js";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/database", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    throw new HttpError(503, "DATABASE_UNAVAILABLE", "The database is unavailable.", {
      cause: error,
    });
  }

  response.status(200).json({
    status: "ok",
    database: "connected",
    timestamp: new Date().toISOString(),
  });
});
