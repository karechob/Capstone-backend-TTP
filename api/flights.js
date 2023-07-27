const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

router.post('/departure', async function (req, res, next) {
  console.log("this is req body", req.body.name)
  try {
    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/locations',
      params: {name: req.body.name}, //required (sample location)
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
        departureAirport: airport.id,
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

router.post('/return', async function (req, res, next) {
  try {
    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v1/flights/locations',
      params: {name: req.body.name}, //required (sample location)
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
        returnAirport: airport.id,
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


router.post('/allflights', async function (req, res, next) {
  try {

    const departureDate = req.body.departure;
    const returnDate = req.body.return;
    const departureAndReturnDates = `${departureDate},${returnDate}`;

    const departureAirport = req.body.departureAirport;
    const returnAirport = req.body.returnAirport;
    const origin = `${departureAirport},${returnAirport}`;
    const destination = `${returnAirport},${departureAirport}`;

    const options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip',
      params: {
        departure_date: departureAndReturnDates, //need this value from user '2023-08-01,2023-08-09'
        adults: '1', //maximum 8 
        sid: 'iSiX639',
        origin_airport_code: origin, //get this value through /airport --> airport.id
        destination_airport_code: destination, //get this value through /airport  --> airport.id
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
    const airlineLink = allFlightsResult.airline_data;
    const flightInformation = {};

    for (let i = 0; i < 4; i++) {
      const airlineKey = `airline_${i}`;
      if (airlineLink.hasOwnProperty(airlineKey)) {
        const sliceData = airlineLink[airlineKey];
        const name = sliceData.name;
        const website = sliceData.websiteUrl;
        const phone = sliceData.phoneNumber;
        if (website && phone !== '') {
          flightInformation[airlineKey] = {
            name: name,
            website: website,
            phone: phone,
          };
        }
      }

      const itineraryKey = `itinerary_${i}`;
      if (itinararies.hasOwnProperty(itineraryKey)) {
        const sliceData = itinararies[itineraryKey].slice_data.slice_0;
        const airline = sliceData.airline;
        const departure = sliceData.departure;
        const arrival = sliceData.arrival;
        const priceDetails = itinararies[itineraryKey].price_details.baseline_total_fare;

        flightInformation[itineraryKey] = {
          itinerary: itineraryKey,
          airline: airline,
          departure: departure,
          arrival: arrival,
          price: priceDetails
        };
      }
    }

    res.json(flightInformation);
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;