const router = require("express").Router();
const { Activity } = require("../db/models");

//fetch all activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await Activity.findAll();

    allActivities
      ? res.status(200).json(allActivities)
      : res.status(404).send("No activities found");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
