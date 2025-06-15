import { Request, Response, NextFunction } from "express";
import logger from "@infra/logger";

// Erros customizados
export class BadRequestError extends Error {
  status = 400;
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  status = 404;
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {
  status = 500;
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

// Middleware de erro robusto
type CustomError =
  | BadRequestError
  | UnauthorizedError
  | NotFoundError
  | InternalServerError
  | Error;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: CustomError, req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let message = "Internal server error";

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof NotFoundError ||
    err instanceof InternalServerError
  ) {
    status = (err as any).status;
    message = err.message;
  }

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
