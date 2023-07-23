const User = require("./user");
const Trip = require("./trip");
const Activity = require("./activity");
const Flight = require("./flight");
const Hotel = require("./hotel");
const Collaborator = require("./collaborator");

// User.belongsToMany(Trip, {
//   through: "collaborator",
//   as: "trips",
//   foreignKey: "userId",
// });
// Trip.belongsToMany(User, {
//   through: "collaborator",
//   as: "collaborators",
//   foreignKey: "tripId",
// });

User.hasMany(Trip, { foreignKey: "ownerId" });

Trip.belongsToMany(Activity, {
  through: "tripActivity",
  as: "activities",
  foreignKey: "tripId",
});
Activity.belongsToMany(Trip, {
  through: "tripActivity",
  as: "trips",
  foreignKey: "activityId",
});

Trip.belongsToMany(Collaborator, {
  through: "tripCollaborator",
  as: "collaborators",
  foreignKey: "tripId",
});

Collaborator.belongsToMany(Trip, {
  through: "tripCollaborator",
  as: "trips",
  foreignKey: "collaboratorId",
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
