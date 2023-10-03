const { Sequelize } = require("sequelize");

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const db = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: "postgres"
  }
);

module.exports = db;