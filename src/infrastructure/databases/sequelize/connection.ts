import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

/**
 * Under NODE_ENV=test the app talks to an in-memory sqlite database, so the
 * suite needs no MySQL server and leaves nothing behind between runs. Mirrored
 * by the `test` environment in config/config.cjs.
 */
function createConnection(): Sequelize {
  if (process.env.NODE_ENV === "test") {
    return new Sequelize({ dialect: "sqlite", storage: ":memory:", logging: false });
  }

  return new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT ?? 3306),
      dialect: "mysql",
      logging: false,
    },
  );
}

export const sequelize = createConnection();
