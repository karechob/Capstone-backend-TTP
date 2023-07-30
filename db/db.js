const { Sequelize } = require("sequelize");
require("dotenv").config();
require("pg");

// const db = new Sequelize(`postgres://localhost:5432/${name}`, {
//     logging: false,
// });
const db = process.env.NODE_ENV == "dev" ?  new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || "localhost",
    dialect:
      "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    logging: false,
  }
) :  new Sequelize (
  `${process.env.POSTGRES_URL}?sslmode=require`
);


module.exports = db;
