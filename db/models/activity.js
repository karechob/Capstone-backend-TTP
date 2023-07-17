const { DataTypes } = require("sequelize");
const db = require("../db");

const Activity = db.define("activity", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Activity;
