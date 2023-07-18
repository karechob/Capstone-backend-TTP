const router = require("express").Router();
const { User } = require("../db/models");
const isAuthorized = require("../middleware/authMiddleware");

// Mounted on /auth
router.use("/login", require("./login"));
router.use("/logout", require("./logout"));
router.use("/signup", require("./signup"));
router.use("/google", require("./google"));

module.exports = router;
