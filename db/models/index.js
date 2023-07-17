const User = require("./user");
const Trip = require("./trip");
const Activity = require("./activity");
const FlightDetails = require("./flight");
const HotelDetails = require("./hotel");

User.belongsToMany(Trip, { through: "Collaborators", foreignKey: "userId" });
Trip.belongsToMany(User, { through: "Collaborators", foreignKey: "tripId" });

Trip.belongsToMany(Activity, {
  through: "TripActivities",
  foreignKey: "tripId",
});
Activity.belongsToMany(Trip, {
  through: "TripActivities",
  foreignKey: "activityId",
});

Trip.hasOne(HotelDetails, { foreignKey: "tripId" });
HotelDetails.belongsTo(Trip, { foreignKey: "tripId" });

Trip.hasOne(FlightDetails, { foreignKey: "tripId" });
FlightDetails.belongsTo(Trip, { foreignKey: "tripId" });

module.exports = {
  User,
  Trip,
  Activity,
  FlightDetails,
  HotelDetails,
};
