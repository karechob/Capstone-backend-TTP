const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

router.post("/information", async function (req, res, next) {
  try {
    console.log("Fetching hotels");

    const destinationOptions = {
      method: "GET",
      url: "https://booking-com.p.rapidapi.com/v1/hotels/locations",
      params: {
        locale: "en-gb",
        name: req.body.destination,
      },
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
      },
    };

    const destinationResponse = await axios.request(destinationOptions);
    if (
      destinationResponse.data &&
      Array.isArray(destinationResponse.data) &&
      destinationResponse.data.length > 0
    ) {
      const dest_id = destinationResponse.data[0].dest_id;
      const informationOptions = {
        method: "GET",
        url: "https://booking-com.p.rapidapi.com/v2/hotels/search",
        params: {
          dest_type: "city",
          room_number: "1",
          units: "metric",
          checkout_date: req.body.checkoutDate,
          locale: "en-us",
          dest_id: dest_id,
          filter_by_currency: "USD",
          checkin_date: req.body.startDate,
          adults_number: "2",
          order_by: "popularity",
          categories_filter_ids: req.body.hotelBudgetRange,
          page_number: "0",
          include_adjacency: "true",
        },
        headers: {
          "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
        },
      };

      const informationResponse = await axios.request(informationOptions);
      const allHotels = {};

      if (
        informationResponse.data &&
        informationResponse.data.results &&
        informationResponse.data.results.length > 0
      ) {
        for (let i = 0; i < 20; i++) {
          const hotelKey = `hotel_${i}`;
          if (informationResponse.data.results[i]) {
            allHotels[hotelKey] = informationResponse.data.results[i];
          }
        }
      }
      res.json(allHotels);
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  } catch (error) {
    console.log("error");
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
