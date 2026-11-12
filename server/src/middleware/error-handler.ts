import type { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../errors/http-error.js";

export const notFound: RequestHandler = (request, response) => {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${request.method} ${request.originalUrl} was not found.`,
    },
  });
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);

  const status = error instanceof HttpError ? error.status : 500;
  const code = error instanceof HttpError ? error.code : "INTERNAL_SERVER_ERROR";
  const message =
    error instanceof HttpError
      ? error.message
      : env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

  response.status(status).json({
    error: {
      code,
      message,
    },
  });
};
