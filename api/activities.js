const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

router.get("/allactivities", async function (req, res, next) {
  //const destination = req.trip.destination;
  //if (destination) {
  try {
    const textSearch = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=chicago&radius=50000&key=${process.env.PLACES_API_KEY}`
    );

    let latitude = textSearch.data.results[0].geometry.location.lat;
    let longitude = textSearch.data.results[0].geometry.location.lng;

    const nearbySearch = await axios.get(
      ` https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=50000&type=restaurant&key=${process.env.PLACES_API_KEY}`
    );
    res.json(nearbySearch.data);
  } catch (error) {
    console.error();
  }
  //}
});

module.exports = router;
