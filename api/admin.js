const router = require("express").Router();
const { Flight, User, Trip, Hotel, Activity } = require("../db/models");
const isAdmin = require("../middleware/adminMiddleware");
const { Op } = require("sequelize");

const {
  isAuthorized,
  isAuthenticated,
} = require("../middleware/authMiddleware");

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
    console.log(error);
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
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: identifier }, { id: identifier }],
        },
      });

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

// // Delete user by ID
// router.delete("/:id", isAuthenticated, isAdmin, async (req, res, next) => {
//   try {
//     const userId = req.params.id;
//     console.log(userId);
//     const user = await User.findByPk(userId);
//     if (!user) {
//       res.status(400).send("Failed to delete user");
//     }
//     //await user.destroy();
//     res.status(200).send("User deleted successfully");
//   } catch (error) {
//     next(error);
//   }
// });

/*--------------------------------------------------------------*/
module.exports = router;
