import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "@domain/errors";
import logger from "@infra/logger";

/**
 * Errors that only make sense at the HTTP boundary. Anything a use case or a
 * service raises belongs in `@domain/errors` instead.
 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(500, message);
  }
}

/**
 * Maps a thrown error onto a status code, or null when the error is unknown to
 * us -- unknown errors become a 500 with a generic body so internals never
 * reach the client.
 */
function statusFor(err: Error): number | null {
  if (err instanceof HttpError) return err.status;
  if (err instanceof BadRequestError) return 400;
  if (err instanceof NotFoundError) return 404;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  const mapped = statusFor(err);
  const status = mapped ?? 500;
  const message = mapped === null ? "Internal server error" : err.message;

  logger.error({
    message: err.message,
    stack: err.stack,
    status,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(status).json({
    status,
    message,
  });
}
