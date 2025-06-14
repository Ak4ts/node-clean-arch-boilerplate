import { createApp } from "./infrastructure/express/app.js";
import dotenv from 'dotenv';

dotenv.config();

console.log('Variáveis de ambiente:', {
  DB: process.env.DB,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

try {
  createApp().listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
} catch (error) {
  console.error("Error starting the server:", error);
  process.exit(1);
}