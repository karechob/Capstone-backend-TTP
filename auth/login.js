const router = require("express").Router();
const { User } = require("../db/models");

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await user.correctPassword(req.body.password))) {
      return res.status(401).json({ error: "Invalid login attempt" });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      console.log(`Logged in as ${user.username}`);
      return res.status(200).json({ message: "Logged in successfully" });
    });
    req.user = user;
    req.session.save();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
