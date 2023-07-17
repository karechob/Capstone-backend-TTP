const router = require("express").Router();

router.use("/users", require("./user"));

router.use("/trips", require("./trips"));

router.use("/hotels", require("./hotels"));

router.use("/flights", require("./flights"));

router.use("/activities", require("./activities"));

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
