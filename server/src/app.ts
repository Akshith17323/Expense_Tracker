import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

const allowedOrigins =
  env.CORS_ORIGIN === "*"
    ? true
    : env.CORS_ORIGIN.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.status(200).json({
    name: "Expense Tracker API",
    version: "0.1.0",
  });
});

app.use("/health", healthRouter);

app.use(notFound);
app.use(errorHandler);
