const router = require("express").Router();
const { Hotel } = require("../db/models");

// Fetch all hotels
router.get("/", async (req, res, next) => {
  try {
    const allHotels = await Hotel.findAll();

    allHotels
      ? res.status(200).json(allHotels)
      : res.status(404).send("No hotels found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
