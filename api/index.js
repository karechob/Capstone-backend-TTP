const router = require("express").Router();
const isAuthorized = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
router.use("/users", isAdmin, require("./user"));

router.use("/trips", isAuthorized, require("./trips"));

router.use("/hotels", isAuthorized, require("./hotels"));

router.use("/flights", isAuthorized, require("./flights"));

router.use("/activities", isAuthorized, require("./activities"));

router.use("/profile", isAuthorized, require("./profile"));

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
