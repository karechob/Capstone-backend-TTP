const router = require("express").Router();
const { Trip } = require("../db/models");

// Fetch all Trips
router.get("/", async (req, res, next) => {
  try {
    const allTrips = await Trip.findAll();

    allTrips
      ? res.status(200).json(allTrips)
      : res.status(404).send("No Trips found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;