const router = require("express").Router();
const { Op } = require("sequelize");
const { User, Trip, Activity, Flight, Hotel } = require("../db/models");
const isAdmin = require("../middleware/adminMiddleware");
const { isAuthenticated } = require("../middleware/authMiddleware");

/*------------------------ User Controls -----------------------*/
// Fetch user details
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

// Fetch user history (trips, flights, and hotels)
router.get("/history", isAuthenticated, async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    if (!ownerId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const trips = await Trip.findAll({ where: { ownerId } });
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "No trips found for the user" });
    }
    const tripIds = trips.map((trip) => trip.id);
    const flights = await Flight.findAll({ where: { tripId: tripIds } });
    const hotels = await Hotel.findAll({ where: { tripId: tripIds } });
    const responseData = {
      trips: trips,
      flights: flights,
      hotels: hotels,
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// Fetch user record
router.get("/record", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    user
      ? res.status(200).json(user)
      : res.status(404).json({ error: "User Not Found" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Update user details
router.put("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(400).json({ error: "Failed to update user" });
    }
    await user.update(req.body);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(400).json({ error: "Failed to delete user" });
    }
    //await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/*------------------- Collaborator Controls --------------------*/

// add user collaborator
router.post(
  "/:tripId/collaborators",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const tripId = req.params.tripId;
      const { email, username } = req.body;
      let collaborator;
      if (email) {
        collaborator = await User.findOne({ where: { email } });
      } else if (username) {
        collaborator = await User.findOne({ where: { username } });
      }
      if (!collaborator) {
        return res.status(404).json({ error: "Collaborator not found" });
      }
      const trip = await Trip.findByPk(tripId);
      const isCollaborator = await trip.hasCollaborator(collaborator);
      if (isCollaborator) {
        return res
          .status(400)
          .json({ error: "User is already a collaborator" });
      }
      await trip.addCollaborator(collaborator);
      res.status(200).json({ message: "Collaborator added successfully" });
    } catch (error) {
      next(error);
    }
  }
);

/*------------------------ Trip Controls -----------------------*/

// Fetch user trips
router.get("/trips", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findByPk(userId, {
      include: {
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
    });

    if (!user) {
      res.status(400).json({ error: "User not found." });
    }

    const trips = user.dataValues.trips;
    res.status(200).send(trips);
  } catch (error) {
    next(error);
  }
});

// Update trip
router.put("/:tripId", isAuthenticated, async (req, res, next) => {
  try {
    const tripId = req.body.id;
    console.log(req.body.id);
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      res.status(400).json({ error: "Failed to update trip" });
    } else {
      await trip.update(req.body);
      res.status(200).json({ message: "Trip updated successfully" });
    }
  } catch (error) {
    next(error);
  }
});

// add trip
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const tripData = { ...req.body, ownerId };
    const trip = await Trip.create(tripData);
    if (!trip) {
      res.status(400).json({ error: "Failed to create trip" });
    } else {
      res.status(200).json({ message: "Trip added successfully" });
    }
  } catch (error) {
    next(error);
  }
});

// delete current trip
router.delete("/trip", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const currentTrip = await Trip.findOne({
      where: {
        isCurrent: true,
        ownerId: userId,
      },
    });

    if (!currentTrip) {
      return res.status(404).json({ error: "Current trip not found" });
    }

    await currentTrip.destroy();
    console.log(currentTrip);

    res.status(200).json({ message: "Current trip deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/*--------------------------------------------------------------*/

module.exports = router;
