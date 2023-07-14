const { DataTypes } = require("sequelize");
const db = require("../db");

const Activity = db.define('activity', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Activity;