const User = require("./user");
const Trip = require("./trip");
const Activity = require("./activity");
const Flight = require("./flight");
const Hotel = require("./hotel");

User.belongsToMany(Trip, { through: "collaborators", foreignKey: "userId" });
Trip.belongsToMany(User, { through: "collaborators", foreignKey: "tripId" });

Trip.belongsToMany(Activity, {
  through: "tripActivities",
  foreignKey: "tripId",
});
Activity.belongsToMany(Trip, {
  through: "tripActivities",
  foreignKey: "activityId",
});

Trip.hasOne(Hotel, { foreignKey: "tripId" });
Hotel.belongsTo(Trip, { foreignKey: "tripId" });

Trip.hasOne(Flight, { foreignKey: "tripId" });
Flight.belongsTo(Trip, { foreignKey: "tripId" });

module.exports = {
  User,
  Trip,
  Activity,
  Flight,
  Hotel,
};
