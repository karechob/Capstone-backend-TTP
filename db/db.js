const { Sequelize } = require("sequelize");
require("dotenv").config();
require("pg");

// const db = new Sequelize(`postgres://localhost:5432/${name}`, {
//     logging: false,
// });
const db = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || "localhost",
    dialect:
      "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    logging: false,
  }
);

//for seeding production db
// const db = new Sequelize (
//   "postgres://default:HD7ALUskqBN8@ep-shy-voice-12880499-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
// )

module.exports = db;
