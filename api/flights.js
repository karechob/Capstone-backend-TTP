const router = require("express").Router();
const axios = require("axios");
require("dotenv").config();

function processAirportData(allAirports) {
  for (const airport of allAirports) {
    if (airport.lat && airport.lon !== 0) {
      return {
        itemName: airport.itemName,
        airportId: airport.id,
        stateCode: airport.stateCode,
        countryCode: airport.countryCode,
        cityName: airport.cityName,
        provinceName: airport.provinceName,
        entered: airport.entered,
        lat: airport.lat ? airport.lat : 0,
        lon: airport.lon ? airport.lon : 0,
      };
    }
  }
  return null;
}

router.post("/allflights", async function (req, res, next) {
  try {
    console.log("Fetching flights");
    const departureOptions = {
      method: "GET",
      url: "https://priceline-com-provider.p.rapidapi.com/v1/flights/locations",
      params: { name: req.body.destination }, // Replace with the correct field for the departure city
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
      },
    };

    const returnOptions = {
      method: "GET",
      url: "https://priceline-com-provider.p.rapidapi.com/v1/flights/locations",
      params: { name: req.body.origin }, // Replace with the correct field for the return city
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
      },
    };

    const [departureResponse, returnResponse] = await Promise.all([
      axios.request(departureOptions),
      axios.request(returnOptions),
    ]);

    const departureAirport = processAirportData(departureResponse.data);
    const returnAirport = processAirportData(returnResponse.data);

    const departureAndReturnDates = `${req.body.startDate},${req.body.endDate}`;
    const origin = `${departureAirport.airportId},${returnAirport.airportId}`;
    const destination = `${returnAirport.airportId},${departureAirport.airportId}`;

    const options = {
      method: "GET",
      url: "https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip",
      params: {
        departure_date: departureAndReturnDates, //need this value from user '2023-08-01,2023-08-09'
        adults: "1", //maximum 8
        sid: "iSiX639",
        origin_airport_code: origin, //get this value through /airport --> airport.id
        destination_airport_code: destination, //get this value through /airport  --> airport.id
        number_of_itineraries: "4",
        currency: "USD",
      },
      headers: {
        "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "priceline-com-provider.p.rapidapi.com",
      },
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
        if (website && phone !== "") {
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
        const priceDetails =
          itinararies[itineraryKey].price_details.baseline_total_fare;

        flightInformation[itineraryKey] = {
          itinerary: itineraryKey,
          airline: airline,
          departure: departure,
          arrival: arrival,
          price: priceDetails,
        };
      }
    }

    res.json(flightInformation);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
