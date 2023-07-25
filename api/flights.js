const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

router.get('/allflights', async function (req, res, next) {
  try {
    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip',
      params: {
        departure_date: '2023-12-21,2023-12-25',
        adults: '1',
        sid: 'iSiX639',
        origin_airport_code: 'YWG,JFK',
        destination_airport_code: 'JFK,YWG',
        number_of_itineraries: '4'
      },
      headers: {
        'X-RapidAPI-Key': process.env.X_FLIGHT_API_KEY,
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    const allFlightsResult = response.data.getAirFlightRoundTrip.results.result;
    const baselineTotalFare = allFlightsResult.itinerary_data;
    const prices = [];

    for (let i = 0; i < 4; i++) {
      const key = `itinerary_${i}`;
      if (baselineTotalFare.hasOwnProperty(key)) {
        const sliceData = baselineTotalFare[key].slice_data.slice_0;
        const airline = sliceData.airline;
        const departure = sliceData.departure;
        const arrival = sliceData.arrival;

        const priceDetails = baselineTotalFare[key].price_details.baseline_total_fare;

        prices.push({
          itinerary: key,
          airline: airline,
          departure: departure,
          arrival: arrival,
          price: priceDetails
        });
      }
    }

    res.json(prices);
  } catch (error) {
    console.log(error)
  }
})
//baseline_total_fare

// [
//   "itinerary_0 : 470.01",
//   "itinerary_1 : 470.53",
//   "itinerary_2 : 481.32",
//   "itinerary_3 : 481.32"
// ]


module.exports = router;