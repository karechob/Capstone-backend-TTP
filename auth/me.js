const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res, next) => {
  const { name, username, email, isAdmin, googleId, createdAt, updatedAt } =
    req.user;
  const user = {
    name,
    username,
    email,
    isAdmin,
    createdAt,
    updatedAt,
  };

  if (googleId) {
    user.googleId = googleId;
  }

  res.status(200).json(user);
});

module.exports = router;
