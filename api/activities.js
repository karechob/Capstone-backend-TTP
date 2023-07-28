const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

router.post("/allactivities", async (req, res, next) => {
  try {
    console.log("Fetching activities");
    const resultsArray = [];

    // Takes in a destination param provided from the frontend to request a single place from that location
    var textSearchOptions = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.body.destination}&radius=50000&key=${process.env.PLACES_API_KEY}`,
      headers: {},
    };

    const textSearch = await axios.request(textSearchOptions);

    // The response data from the previous call gives a latitude and longitude that is needed for the next api calls
    let latitude = textSearch.data.results[0].geometry.location.lat;
    let longitude = textSearch.data.results[0].geometry.location.lng;

    // Calling the nearbySearch request will return a list of places in the area provided by the latitude and longitude. Limited to only return tourist attractions or related places.
    var tourist_attraction = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=50000&type=tourist_attraction&key=${process.env.PLACES_API_KEY}`,
      headers: {},
    };

    const tourist_attraction_Search = axios.request(tourist_attraction);

    // Another nearbySearch request with the type specified as restaurants or food places.
    var food = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=50000&minprice=${req.body.activitiesBudgetRange}&type=restaurant&key=${process.env.PLACES_API_KEY}`,
      headers: {},
    };

    const food_Search = axios.request(food);

    // Using a Promise.allSettled() method to handle the multiple axios requests.
    const results = await Promise.allSettled([
      tourist_attraction_Search,
      food_Search,
    ]);

    // Pushing the necessary response data items from the results to a resultsArray
    results.map((obj) => {
      obj.value.data.results.map((item, index) => {
        if (index < 5) {
          resultsArray.push(item);
        }
      });
    });

    //console.log(resultsArray);
    res.json(resultsArray);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
