const router = require("express").Router();
const axios = require('axios')
require('dotenv').config();

// Middleware to handle CORS issues during development
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.get('/images/:slug', async (req, res) => {
    try {
      // Make the API call to the given endpoint
      const response = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${req.params.slug}/images/`);
      
      const photos = response.data.photos[0].image
      // Send the response data as JSON
      res.json(photos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
  });

module.exports = router;