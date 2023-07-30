const { DataTypes } = require("sequelize");
const db = require("../db");

const Activity = db.define("activity", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_level: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  popularity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  place_images: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  map_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Activity;
