const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

router.get('/allflights', async function(req, res, next) {
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

          for (const key in baselineTotalFare){
              const pricebaseline = baselineTotalFare[key]
            if(baselineTotalFare.hasOwnProperty(key)){
              console.log(`${key} : ${JSON.stringify(pricebaseline.slice_data)}`)
              prices.push(`${key} : ${pricebaseline.price_details.baseline_total_fare}`)
            }
          }


          
          res.json(baselineTotalFare);
    } catch (error) {
        console.log(error)
    }
}) 
//baseline_total_fare



module.exports = router;