const router = require("express").Router();
const axios = require("axios");
const { isAuthenticated } = require("../middleware/authMiddleware");
require("dotenv").config();

router.post("/", isAuthenticated, async function (req, res, next) {
  try {
    const apiKey = process.env.NINJA_API_KEY;
    const name = req.body.name;
    const response = await axios.get("https://api.api-ninjas.com/v1/city", {
      params: { name },
      headers: {
        "X-Api-Key": apiKey,
      },
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;
