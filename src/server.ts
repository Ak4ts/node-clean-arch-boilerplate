import dotenv from 'dotenv';
import { createApp } from "./infrastructure/express/app.js";
import https from "https";
import fs from "fs";
import path from "path";

dotenv.config();

const certPath = path.resolve("certs/cert.crt");
const keyPath = path.resolve("certs/cert.key");

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

try {
  https.createServer(options, createApp()).listen(process.env.PORT || 5000, () => {
    console.log("HTTPS server is running on https://localhost:" + (process.env.PORT || 5000));
  });
} catch (error) {
  console.error("Error starting the HTTPS server:", error);
  process.exit(1);
}