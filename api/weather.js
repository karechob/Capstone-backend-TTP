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

router.get("/getWeather/:slug", async (req, res) => {
	try {
		const response = await axios.get(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${req.params.slug}?unitGroup=metric&key=AWCP42Q65DY8TJUX3ZUEACCQZ&contentType=json`
		);
        console.log("response: " ,response.data)
        res.json(response.data);
	} catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

module.exports = router;
