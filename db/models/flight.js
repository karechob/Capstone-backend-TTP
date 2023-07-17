const { DataTypes } = require("sequelize");
const db = require("../db");

const Flight = db.define("flight", {
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Flight;
