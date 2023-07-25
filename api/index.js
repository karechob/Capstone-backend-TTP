const router = require("express").Router();

router.use("/me", require("./user"));
router.use("/admin", require("./admin"));
router.use("/flights", require("./flights"))
router.use("/teleport", require("./teleport"))

router.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
