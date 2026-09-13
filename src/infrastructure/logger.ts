import fs from "fs";
import { createLogger, format, transports, transport as Transport } from "winston";
import path from "path";

const isTest = process.env.NODE_ENV === "test";

function buildTransports(): Transport[] {
  // Tests assert on logger calls, not on log output: writing files and
  // colourised console noise from expected-error cases helps nobody.
  if (isTest) {
    return [new transports.Console({ silent: true })];
  }

  const logDir = path.resolve(process.cwd(), "logs");
  // The File transports do not create their target directory, and fail
  // asynchronously when it is missing -- which on a fresh clone is always.
  fs.mkdirSync(logDir, { recursive: true });

  const fileTransports: Transport[] = [
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  ];

  if (process.env.NODE_ENV !== "production") {
    fileTransports.push(
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    );
  }

  return fileTransports;
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: buildTransports(),
});

export default logger;
