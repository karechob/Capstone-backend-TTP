const router = require("express").Router();
const axios = require("axios");
//const { Activity } = require("../db/models");
require("dotenv").config();

router.get("/activities", async function (req, res, next) {
  if (req.body.destination) {
    try {
      const textSearch = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.body.destination}}&radius=50000&key=${process.env.PLACES_API_KEY}`
      );

      let latitude = textSearch.data.results[0].geometry.location.lat;
      let longitude = textSearch.data.results[0].geometry.location.lng;

      const nearbySearch = await axios.get(
        ` https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=50000&type=point_of_interest&key=${process.env.PLACES_API_KEY}`
      );
      res.json(nearbySearch.data);
    } catch (error) {
      console.error();
    }
  }
});

module.exports = router;
