const router = require("express").Router();
const axios = require('axios')
const bodyParser = require('body-parser');
require('dotenv').config();



router.post('/destination', async function (req, res, next) {
    try {
        const options = {
            method: 'GET',
            url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
            params: {
                locale: 'en-gb',
                name: req.body.name //input by user
            },
            headers: {
                'X-RapidAPI-Key': process.env.X_HOTEL_API_KEY,
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            // store data in id object
            const info = response.data.reduce((acc, location) => {
                acc[location.type] = location;
                return acc;
            }, {});
            res.json(info) //we care about dest id for /information call
        }

    } catch (error) {
        console.log(error)
    }
})


router.post('/information', async function (req, res, next) {
    try {

        const checkout_date = req.body.checkin_date;


        const options = {
            method: 'GET',
            url: 'https://booking-com.p.rapidapi.com/v2/hotels/search',
            params: {
                dest_type: 'city',
                room_number: '1',
                units: 'metric',
                checkout_date: req.body.checkout_date, //user input (2023-08-29)
                locale: 'en-gb',
                dest_id: req.body.dest_id, //getting from /destination endpoint
                filter_by_currency: 'USD',
                checkin_date: req.body.checkin_date, //user input (2023-08-27)
                adults_number: '1',
                order_by: 'price',
                categories_filter_ids: req.body.categories_filter_ids, //get from user input (price::USD-140-190)
                page_number: '0',
                include_adjacency: 'true'
            },
            headers: {
                'X-RapidAPI-Key': process.env.X_HOTEL_API_KEY,
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const allHotels = {};

        if (response.data && response.data.results && response.data.results.length > 0) {
            // only 10 hotel results
            for (let i = 0; i < 10; i++) {
                const hotelKey = `hotel_${i}`;
                if (response.data.results[i]) {
                    allHotels[hotelKey] = response.data.results[i];
                }
            }
        }

        res.json(allHotels)
    } catch (error) {
        console.log(error);
    }
})




module.exports = router;