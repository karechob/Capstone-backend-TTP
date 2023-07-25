const router = require("express").Router();

router.get("/", (req, res, next) => {
  const user = req.user.dataValues.username;
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.session.destroy((error) => {
      if (error) {
        console.error("Error occurred during logout:", error);
        return res
          .status(500)
          .json({ error: "An error occurred during logout" });
      }
      console.log(`${user} logged out successfully`);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
