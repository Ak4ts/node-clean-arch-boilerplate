import { Request, Response } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BadRequestError, NotFoundError } from "@domain/errors";
import logger from "@infra/logger";
import {
  errorHandler,
  HttpError,
  InternalServerError,
  UnauthorizedError,
} from "@infra/express/middlewares/error-handler";

function makeResponse() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res as unknown as Response & { status: ReturnType<typeof vi.fn> };
}

const request = { originalUrl: "/tests/1", method: "GET" } as Request;

function handle(err: Error) {
  const res = makeResponse();
  errorHandler(err, request, res, vi.fn());
  return res;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("errorHandler status mapping", () => {
  it.each([
    [new BadRequestError("bad"), 400],
    [new NotFoundError("gone"), 404],
    [new UnauthorizedError(), 401],
    [new InternalServerError(), 500],
    [new HttpError(418, "teapot"), 418],
  ])("maps %s to %i", (err, status) => {
    const res = handle(err);

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({ status, message: err.message });
  });
});

describe("errorHandler on unknown errors", () => {
  it("answers 500 without echoing the thrown message", () => {
    const res = handle(new Error("connect ECONNREFUSED 10.0.0.4:3306 user=root password=hunter2"));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ status: 500, message: "Internal server error" });
  });

  it("still records the real cause in the log", () => {
    const error = vi.spyOn(logger, "error").mockReturnValue(logger);
    handle(new Error("underlying failure"));

    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "underlying failure",
        status: 500,
        url: "/tests/1",
        method: "GET",
      }),
    );
  });
});

describe("domain errors", () => {
  it("name themselves so logs identify the class", () => {
    expect(new BadRequestError().name).toBe("BadRequestError");
    expect(new NotFoundError().name).toBe("NotFoundError");
    expect(new UnauthorizedError().name).toBe("UnauthorizedError");
  });

  it("carry usable defaults", () => {
    expect(new BadRequestError().message).toBe("Bad Request");
    expect(new NotFoundError().message).toBe("Not Found");
  });
});
