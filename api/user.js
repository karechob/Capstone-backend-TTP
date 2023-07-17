const router = require("express").Router();
const { User } = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll({ attributes: ["id", "email"] });
    allUsers
      ? res.status(200).json(allUsers)
      : res.status(404).send("Users List Not Found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
