import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { initTestModel } from "./models/test-model";
import { initUserModel } from "./models/user-model";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: "mysql",
    logging: false,
  },
);

// Inicialização dos models
initTestModel(sequelize);
initUserModel(sequelize);

export { sequelize };

export * from "./models";
export * from "./repositories";
