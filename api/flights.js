const router = require("express").Router();
const { Flight } = require("../db/models");

//fetch all flights
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

module.exports = router;