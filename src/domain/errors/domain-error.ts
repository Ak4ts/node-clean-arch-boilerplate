/**
 * Base class for every error the domain is allowed to raise.
 *
 * Domain errors carry no HTTP status and no framework types: mapping them
 * onto a transport belongs to the infrastructure layer (see
 * `@infra/express/middlewares/error-handler`).
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}

/** The caller sent something the domain refuses to accept. */
export class BadRequestError extends DomainError {
  constructor(message = "Bad Request") {
    super(message);
  }
}

/** The caller asked for something that does not exist. */
export class NotFoundError extends DomainError {
  constructor(message = "Not Found") {
    super(message);
  }
}
