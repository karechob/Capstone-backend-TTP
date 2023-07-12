const { DataTypes } = require("sequelize");
const db = require("../db");

const Trip = db.define("trip", {
    Trips_Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Trip_Budget: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    Trip_Activities: {
        type: DataTypes.STRING,
        allowNull: true
    }

    
});

module.exports = Trip;