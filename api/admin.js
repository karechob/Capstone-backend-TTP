const router = require("express").Router();
const { Flight, User, Trip, Hotel, Activity } = require("../db/models");
const isAdmin = require("../middleware/adminMiddleware");
const { isAuthenticated } = require("../middleware/authMiddleware");

/*----------------------- Admin Controls -----------------------*/

// Fetch all users
router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.findAll({
      include: [
        {
          model: Trip,
          as: "trips",
          include: [
            {
              model: Hotel,
            },
            {
              model: Flight,
            },
            {
              model: Activity,
              as: "activities",
              through: { attributes: [] },
            },
            {
              model: User,
              as: "collaborators",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).send("Users List Not Found");
    }

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
});

module.exports = router;

/// Delete user by email or ID
router.delete(
  "/:identifier",
  isAuthenticated,
  isAdmin,
  async (req, res, next) => {
    try {
      const identifier = req.params.identifier;

      let user;
      if (identifier.includes("@")) {
        user = await User.findOne({
          where: {
            email: identifier,
          },
        });
      } else {
        user = await User.findByPk(identifier);
      }

      if (!user) {
        return res.status(404).send("User not found");
      }

      //await user.destroy();
      res.status(200).send("User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

/*--------------------------------------------------------------*/
module.exports = router;
