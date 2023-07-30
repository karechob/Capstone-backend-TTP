const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

router.post("/allactivities", async (req, res, next) => {
  try {
    console.log("Fetching activities");
    const resultsArray = [];

    // Creating activity object with necessary details
    const activityObject = {
      name: "",
      type: "",
      price_level: 0,
      rating: 0,
      popularity: 0,
      place_images: [],
      map_url: "",
    };

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

    // Another nearbySearch request with the type specified as restaurants or food places.
    var food = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=50000&minprice=${req.body.activitiesBudgetRange}&type=restaurant&key=${process.env.PLACES_API_KEY}`,
      headers: {},
    };

    // Axios requests
    const tourist_attraction_list = await axios.request(tourist_attraction); //20 results
    const food_list = await axios.request(food); //20 results

    // Want 5 results from axios requests, requiring place id to be sent to placeDetails call
    for (let i = 0; i < 5; i++) {
      let tourist_attraction_place_id =
        tourist_attraction_list.data.results[i].place_id;

      var tourist_place_details = {
        method: "get",
        url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${tourist_attraction_place_id}&key=${process.env.PLACES_API_KEY}`,
        headers: {},
      };

      // Axios request to fetch place details
      const tourist_place_details_Search = await axios.request(
        tourist_place_details
      );

      // Handles if a place does not have a price level
      if (!tourist_place_details_Search.data.result.price_level) {
        const activityObject = {
          name: tourist_place_details_Search.data.result.name,
          type: tourist_place_details_Search.data.result.types[0],
          price_level: 0,
          rating: tourist_place_details_Search.data.result.rating,
          popularity:
            tourist_place_details_Search.data.result.user_ratings_total,
          place_images: tourist_place_details_Search.data.result.photos,
          map_url: tourist_place_details_Search.data.result.url,
        };

        resultsArray.push(activityObject);
      } else {
        const activityObject = {
          name: tourist_place_details_Search.data.result.name,
          type: tourist_place_details_Search.data.result.types[0],
          price_level: tourist_place_details_Search.data.result.price_level,
          rating: tourist_place_details_Search.data.result.rating,
          popularity:
            tourist_place_details_Search.data.result.user_ratings_total,
          place_images: tourist_place_details_Search.data.result.photos,
          map_url: tourist_place_details_Search.data.result.url,
        };

        resultsArray.push(activityObject);
      }
    }

    for (let i = 0; i < 5; i++) {
      let food_place_id = food_list.data.results[i].place_id;

      var food_place_details = {
        method: "get",
        url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${food_place_id}&key=${process.env.PLACES_API_KEY}`,
        headers: {},
      };

      // Axios request to fetch place details
      const food_place_details_Search = await axios.request(food_place_details);

      // Handles if a place does not have a price level
      if (!food_place_details_Search.data.result.price_level) {
        const activityObject = {
          name: food_place_details_Search.data.result.name,
          type: food_place_details_Search.data.result.types[0],
          price_level: 0,
          rating: food_place_details_Search.data.result.rating,
          popularity: food_place_details_Search.data.result.user_ratings_total,
          place_images: food_place_details_Search.data.result.photos,
          map_url: food_place_details_Search.data.result.url,
        };

        resultsArray.push(activityObject);
      } else {
        const activityObject = {
          name: food_place_details_Search.data.result.name,
          type: food_place_details_Search.data.result.types[0],
          price_level: food_place_details_Search.data.result.price_level,
          rating: food_place_details_Search.data.result.rating,
          popularity: food_place_details_Search.data.result.user_ratings_total,
          place_images: food_place_details_Search.data.result.photos,
          map_url: food_place_details_Search.data.result.url,
        };

        resultsArray.push(activityObject);
      }
    }

    // resultsArray consists of activity objects of tourist attractions and food
    res.json(resultsArray);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
