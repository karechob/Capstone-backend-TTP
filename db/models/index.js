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

// Trip.belongsToMany(Activity, {
//   through: "tripActivity",
//   as: "activities",
//   foreignKey: "tripId",
// });
// Activity.belongsToMany(Trip, {
//   through: "tripActivity",
//   as: "trips",
//   foreignKey: "activityId",
// });

// Trip.belongsToMany(Collaborator, {
//   through: "tripCollaborator",
//   as: "collaborators",
//   foreignKey: "tripId",
// });

// Collaborator.belongsToMany(Trip, {
//   through: "tripCollaborator",
//   as: "trips",
//   foreignKey: "collaboratorId",
// });

User.hasMany(Trip, { foreignKey: "ownerId" });
Trip.belongsTo(User, { foreignKey: "ownerId" });

Trip.hasMany(Collaborator, { foreignKey: "tripId", as: "collaborators" });
Collaborator.belongsTo(Trip, { foreignKey: "tripId" });

Trip.hasMany(Activity, { foreignKey: "tripId", as: "activities" });
Activity.belongsTo(Trip, { foreignKey: "tripId" });

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
