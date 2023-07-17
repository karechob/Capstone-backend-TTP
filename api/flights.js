const router = require("express").Router();
//const { where } = require("sequelize");
const { Flight, User, Trip } = require("../db/models");

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

router.get("/myFlights", async (req, res, next) => {
    try {
      // All trips for current User where they are the owner
      const trips = await Trip.findAll({where: { ownerId: 1 }})
      let flights = [];
      //console.log(trips.length);

      for(let i = 0; i < trips.length; i++) {
        //console.log(trips[i]);
        const currentFlight = await Flight.findOne({where: { tripId: trips[i].dataValues.id}})
        flights.push(currentFlight);
      }

      console.log("flights array: ", flights);
      res.json(flights);
      //const flights = await Flight.findAll({where: {tripId : }})
      //console.log()
    } catch (error) {
      next(error);
    }
});

module.exports = router;