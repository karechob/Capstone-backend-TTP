const router = require("express").Router();
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, (req, res, next) => {
  const { name, username, email, createdAt, updatedAt, image } = req.user;
  const user = {
    name,
    username,
    email,
    createdAt,
    updatedAt,
    image,
  };
  res.status(200).json(user);
});

module.exports = router;
