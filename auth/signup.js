const router = require("express").Router();
const { User } = require("../db/models");

router.post("/", async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).send("Required fields missing");
    }
    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).send("Username already exists");
    }
    if (existingEmail) {
      return res.status(409).send("Email already exists");
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Signed up successfully" });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
