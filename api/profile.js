const router = require("express").Router();

router.get("/", (req, res, next) => {
  const { name, username, email, googleId, createdAt, updatedAt } = req.user;

  const user = {
    name,
    username,
    email,
    createdAt,
    updatedAt,
  };

  if (googleId) {
    user.googleId = googleId;
  }

  res.status(200).json(user);
});

module.exports = router;
