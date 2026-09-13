import dotenv from "dotenv";
import fs from "fs";
import http from "http";
import https from "https";
import { createApp } from "@main";
import logger from "@infra/logger";

dotenv.config();

const port = Number(process.env.PORT ?? 5000);
const certPath = process.env.TLS_CERT_PATH;
const keyPath = process.env.TLS_KEY_PATH;

process.on("uncaughtException", (err) => {
  logger.error({ message: `Uncaught exception: ${err.message}`, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({
    message: `Unhandled rejection: ${reason instanceof Error ? reason.message : String(reason)}`,
    stack: reason instanceof Error ? reason.stack : undefined,
  });
  process.exit(1);
});

/**
 * HTTPS is opt-in: set TLS_CERT_PATH and TLS_KEY_PATH to serve TLS directly.
 * Without them the app speaks plain HTTP and expects TLS to be terminated
 * upstream, which is what a fresh clone and most deployments want.
 */
function createServer(app: http.RequestListener) {
  if (!certPath || !keyPath) {
    return http.createServer(app);
  }
  return https.createServer(
    { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
    app,
  );
}

try {
  const scheme = certPath && keyPath ? "https" : "http";
  createServer(createApp()).listen(port, () => {
    logger.info(`Server listening on ${scheme}://localhost:${port}`);
  });
} catch (error) {
  logger.error({
    message: `Failed to start the server: ${error instanceof Error ? error.message : String(error)}`,
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
}
