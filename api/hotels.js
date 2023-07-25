const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

router.get('/', async function (req, res, next) {
    try {
        const options = {
            method: "GET",
            url: "https://booking-com.p.rapidapi.com/v2/hotels/search",
            params: {
                order_by: "popularity",
                adults_number: "2",
                checkin_date: "2023-09-27",
                filter_by_currency: "AED",
                dest_id: "-553173",
                locale: "en-gb",
                checkout_date: "2023-09-28",
                units: "metric",
                room_number: "1",
                dest_type: "city",
                include_adjacency: "true",
                children_number: "0",
                page_number: "0",
                children_ages: "5,0",
                categories_filter_ids: "class::2,class::4,free_cancellation::1",
            },
            headers: {
                "X-RapidAPI-Key": process.env.X_HOTEL_API_KEY,
                "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
            },
        };

        const response = await axios.request(options);
        const allHotels = response.data;

        res.json(allHotels)
    } catch (error) {
        console.log(error);
    }
})




module.exports = router;