const { Sequelize } = require("sequelize");
require("dotenv").config();

// const db = new Sequelize(`postgres://localhost:5432/${name}`, {
//     logging: false,
// });
const db = new Sequelize({
  host: "localhost",
  dialect:
    "postgres" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  database: process.env.DB_NAME, // Add the database name here
  logging: false,
});

module.exports = db;
