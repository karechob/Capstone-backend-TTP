const router = require("express").Router();
const { Flight, User, Trip } = require("../db/models");

// Fetch all users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll({ attributes: ["id", "email"] });

    allUsers
      ? res.status(200).json(allUsers)
      : res.status(404).send("Users List Not Found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Fetch user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    user ? res.status(200).json(user) : res.status(404).send("User Not Found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id/details", async (req, res, next) => {
  try {
    const ownerId = req.params.id;
    console.log(ownerId);
    const trips = await Trip.findAll({ where: { ownerId } });
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "No trips found for the user" });
    }
    const tripIds = trips.map((trip) => trip.id);
    const flights = await Flight.findAll({ where: { tripId: tripIds } });

    const responseData = {
      trips: trips,
      flights: flights,
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
