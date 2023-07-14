const User = require("./user");
const Trip = require("./trip");
const Activity = require("./activity");

// Associations Go Here

User.hasMany(Trip, { foreignKey: "userId" });
Trip.belongsTo(User, { foreignKey: "userId" });

Trip.belongsToMany(User, { through: Collaborator, foreignKey: "tripId" });
User.belongsToMany(Trip, { through: Collaborator, foreignKey: "userId" });

Trip.hasMany(Activity, { foreignKey: "tripId" });
Activity.belongsTo(Trip, { foreignKey: "tripId" });

Trip.belongsToMany(Activity, {
  through: ActivityTripConnection,
  foreignKey: "tripId",
});
Activity.belongsToMany(Trip, {
  through: ActivityTripConnection,
  foreignKey: "activityId",
});

Trip.hasOne(HotelDetails, { foreignKey: "tripId" });
HotelDetails.belongsTo(Trip, { foreignKey: "tripId" });

Trip.hasOne(FlightDetails, { foreignKey: "tripId" });
FlightDetails.belongsTo(Trip, { foreignKey: "tripId" });
