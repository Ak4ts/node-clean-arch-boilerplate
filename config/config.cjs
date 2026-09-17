require('dotenv').config();

const mysql = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'playground',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql'
};

module.exports = {
  development: mysql,
  // Mirrors src/infrastructure/databases/sequelize/connection.ts so the CLI and
  // the app agree: tests run against an in-memory sqlite database and need no
  // MySQL server.
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: mysql
};
