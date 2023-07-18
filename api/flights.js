const router = require("express").Router();
const { Flight, User, Trip } = require("../db/models");

// fetch all flights
router.get("/", async (req, res, next) => {
  try {
    const allFlights = await Flight.findAll();

    allFlights
      ? res.status(200).json(allFlights)
      : res.status(404).send("No flights found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/myFlights/:id", async (req, res, next) => {
  try {
    const ownerId = req.params.id;
    console.log(ownerId);
    const trips = await Trip.findAll({ where: { ownerId } });
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "No trips found for the user" });
    }
    const tripIds = trips.map((trip) => trip.id);
    const flights = await Flight.findAll({ where: { tripId: tripIds } });
    res.json(flights);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
