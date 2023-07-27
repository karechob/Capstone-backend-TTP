const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

// Middleware to handle CORS issues during development
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get("/getWeather/:slug/:startdate/:enddate", async (req, res) => {
  try {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.params.slug}/${req.params.startdate}/${req.params.enddate}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`;
    console.log("url: ", url);
    const response = await axios.get(url);
    console.log("response: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data" });
  }
});

module.exports = router;
