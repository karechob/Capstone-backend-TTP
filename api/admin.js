const router = require("express").Router();
const { Flight, User, Trip, Hotel, Activity, Collaborator } = require("../db/models");
const isAdmin = require("../middleware/adminMiddleware");
const { isAuthenticated } = require("../middleware/authMiddleware");

/*----------------------- Admin Controls -----------------------*/

// Fetch all users
router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.findAll({
      attributes: {
        exclude: ["id", "password", "salt"],
      },
      include: [
        {
          model: Trip,
          as: "trips",
          attributes: { exclude: ["id"] },
          include: [
            {
              model: Hotel,
              attributes: { exclude: ["id"] },
            },
            {
              model: Flight,
              attributes: { exclude: ["id"] },
            },
            {
              model: Activity,
              as: "activities",
              attributes: { exclude: ["id"] },
            },
            {
              model: Collaborator,
              as: "collaborators",
              attributes: { exclude: ["id"] },
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

      await user.destroy();
      res.status(200).send("User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

/*--------------------------------------------------------------*/
module.exports = router;
