import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
    logging: false,
  }
);

export { sequelize };