const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

router.get('/airport', async function (req, res, next) {
  try {
    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/locations',
      params: {name: 'Venice Italy'}, //required
      headers: {
        'X-RapidAPI-Key':  process.env.X_FLIGHT_API_KEY,
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
    //lat (doesnt exist if its 0)
    //long (doesnt exist if its 0)

    const response = await axios.request(options);
    const allAirports = response.data;
    const airportData = [];

    for (const airport of allAirports) {
      if(airport.lat && airport.lon !== 0)
      airportData.push({
        itemName: airport.itemName,
        id: airport.id,
        stateCode: airport.stateCode,
        countryCode: airport.countryCode,
        cityName: airport.cityName,
        provinceName: airport.provinceName,
        entered: airport.entered,
        lat: airport.lat ? airport.lat : 0,
        lon: airport.lon ? airport.lon : 0
      });
    }
    
    res.json(airportData)
  } catch (error) {
    console.log(error)
  }
})


router.get('/allflights', async function (req, res, next) {
  try {
    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip',
      params: {
        departure_date: '2023-12-21,2023-12-25', //need this value from user
        adults: '1', //maximum 8 //need this value from user
        sid: 'iSiX639',
        origin_airport_code: 'BKK,JFK', //get this value through /airport --> airport.id
        destination_airport_code: 'JFK,BKK', //get this value through /airport  --> airport.id
        number_of_itineraries: '4',
        currency: 'USD'
      },
      headers: {
        'X-RapidAPI-Key': process.env.X_FLIGHT_API_KEY,
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
    const response = await axios.request(options);
    const allFlightsResult = response.data.getAirFlightRoundTrip.results.result;
    const itinararies = allFlightsResult.itinerary_data;
    const flightInformation = [];

    for (let i = 0; i < 4; i++) {
      const key = `itinerary_${i}`;
      if (itinararies.hasOwnProperty(key)) {
        const sliceData = itinararies[key].slice_data.slice_0;
        const airline = sliceData.airline;
        const departure = sliceData.departure;
        const arrival = sliceData.arrival;

        const priceDetails = itinararies[key].price_details.baseline_total_fare;

        flightInformation.push({
          itinerary: key,
          airline: airline,
          departure: departure,
          arrival: arrival,
          price: priceDetails
        });
      }
    }

    res.json(flightInformation);
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