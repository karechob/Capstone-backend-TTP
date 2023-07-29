const router = require("express").Router();
const { User, Trip, Activity, Flight, Hotel } = require("../db/models");
const { isAuthenticated } = require("../middleware/authMiddleware");
const Collaborator = require("../db/models/collaborator");

/*------------------------ User Controls -----------------------*/
// Fetch user details
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

  // if (googleId) {
  //   user.googleId = googleId;
  // }

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
      res.status(400).json({ error: "Failed to update settings" });
    }
    await user.update(req.body);
    console.log(`${user.username} updated settings successfully`);
    res.status(200).json({ message: "Settings updated successfully" });
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
    await user.destroy();
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/*------------------- Collaborator Controls --------------------*/

// add user collaborator
// router.post("/collaborator", isAuthenticated, async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) {
//       return res.status(403).json({ error: "Access denied" });
//     }
//     const tripId = req.params.tripId;
//     const { email, username } = req.body;
//     let collaborator;
//     if (email) {
//       collaborator = await User.findOne({ where: { email } });
//     } else if (username) {
//       collaborator = await User.findOne({ where: { username } });
//     }
//     if (!collaborator) {
//       return res.status(404).json({ error: "Collaborator not found" });
//     }
//     const trip = await Trip.findByPk(tripId);
//     const isCollaborator = await trip.hasCollaborator(collaborator);
//     if (isCollaborator) {
//       return res.status(400).json({ error: "User is already a collaborator" });
//     }
//     await trip.addCollaborator(collaborator);
//     res.status(200).json({ message: "Collaborator added successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/collaborator", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.dataValues.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }
    const { email, username } = req.body;
    let collaboratorData;

    if (email) {
      collaboratorData = await User.findOne({ where: { email } });
    } else if (username) {
      collaboratorData = await User.findOne({ where: { username } });
    }
    const collaborator = {
      id: collaboratorData.dataValues.id,
      name: collaboratorData.dataValues.name,
      username: collaboratorData.dataValues.username,
      email: collaboratorData.dataValues.email,
    };
    if (!collaborator) {
      console.log("Collaborator not found");
      return res.status(404).json({ error: "Collaborator not found" });
    }
    console.log("Collaborator found");
    res.status(200).json({ collaborator });
  } catch (error) {
    next(error);
  }
});

// delete collaborator
router.delete(
  "/trips/:tripId/collaborators/:collaboratorId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const tripId = req.params.tripId;
      const userId = req.user.id;
      const collaboratorId = req.params.collaboratorId;

      if (!userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const trip = await Trip.findByPk(tripId);
      if (!trip) {
        return res.status(400).json({ error: "Failed to find the trip" });
      }

      if (trip.ownerId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not the owner of this trip" });
      }

      const existingCollaborator = await Collaborator.findOne({
        where: { id: collaboratorId, tripId: tripId },
      });

      if (!existingCollaborator) {
        return res.status(404).json({ error: "Collaborator not found" });
      }

      await existingCollaborator.destroy();

      res.status(200).json({ message: "Collaborator deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

/*------------------------ Trip Controls -----------------------*/
router.get("/trip/:id", isAuthenticated, async (req, res, next) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findByPk(tripId, {
      attributes: { exclude: [""] },
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
          attributes: { exclude: [""] },
        },
      ],
    });

    if (!trip) {
      res.status(404).json({ error: "Failed to find trip" });
    } else {
      res.status(200).json(trip);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch user trips
router.get("/trips", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: [
          "id",
          "password",
          "salt",
          "createdAt",
          "updatedAt",
          "isAdmin",
          "googleId",
        ],
      },
      include: {
        model: Trip,
        as: "trips",
        attributes: { exclude: [""] },
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
            attributes: { exclude: [""] },
          },
        ],
      },
    });

    if (!user) {
      res.status(400).json({ error: "User not found." });
    }

    const trips = user.dataValues.trips;
    //console.log(trips);
    res.status(200).send(trips);
  } catch (error) {
    next(error);
  }
});

// add trip
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const {
      hotel: hotelData,
      flight: flightData,
      activities: activitiesData,
      collaborators: collaboratorsData,
      ...tripDataWithoutHotelAndFlight
    } = req.body;
    const tripData = { ...tripDataWithoutHotelAndFlight, ownerId };
    const lastTrip = await Trip.findOne({
      where: {
        ownerId,
        isCurrent: true,
      },
      order: [["createdAt", "DESC"]],
    });

    if (lastTrip) {
      await lastTrip.update({ isCurrent: false });
    }
    const trip = await Trip.create(tripData);
    if (trip) {
      if (hotelData) {
        const createdHotel = await Hotel.create(hotelData);
        await trip.setHotel(createdHotel);
      }

      if (flightData) {
        const createdFlight = await Flight.create(flightData);
        await trip.setFlight(createdFlight);
      }
      if (activitiesData && Array.isArray(activitiesData)) {
        for (const activityData of activitiesData) {
          const createdActivity = await Activity.create(activityData);
          await trip.addActivity(createdActivity);
        }
      }
      if (collaboratorsData && Array.isArray(collaboratorsData)) {
        const collaboratorsWithoutId = collaboratorsData.map(
          ({ id, ...rest }) => rest
        );
        for (const collaboratorData of collaboratorsWithoutId) {
          const createdCollaborator = await Collaborator.create(
            collaboratorData
          );
          await trip.addCollaborator(createdCollaborator);
        }
      }

      console.log("Trip added successfully");
      res.status(200).json({ message: "Trip added successfully" });
    } else {
      console.log("Failed to create trip");
      res.status(400).json({ error: "Failed to create trip" });
    }
  } catch (error) {
    next(error);
  }
});

// Update trip
router.put("/trip", isAuthenticated, async (req, res, next) => {
  try {
    const tripId = req.body.id;
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(400).json({ error: "Failed to update trip" });
    }

    if (trip.ownerId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this trip" });
    }

    // const { hotel, flight, activities, collaborators, ...tripDetails } =
    //   req.body;
    const { collaborators, ...tripDetails } = req.body;

    console.log("Updating trip");
    await trip.update(tripDetails);

    // if (hotel) {
    //   const existingHotel = await Hotel.findOne({ where: { tripId } });
    //   if (existingHotel) {
    //     console.log("Updating hotel");
    //     await existingHotel.update(hotel);
    //   }
    // }

    // if (flight) {
    //   const existingFlight = await Flight.findOne({ where: { tripId } });
    //   if (existingFlight) {
    //     console.log("updating flight");

    //     await existingFlight.update(flight);
    //   }
    // }

    // if (activities && Array.isArray(activities)) {
    //   for (const activityData of activities) {
    //     try {
    //       const existingActivity = await Activity.findOne({
    //         where: { tripId: tripId },
    //       });
    //       if (existingActivity) {
    //         console.log("updating activity");
    //         await existingActivity.update(activityData);
    //       } else {
    //         console.log("activity not found");
    //       }
    //     } catch (error) {
    //       console.error("Error while updating activity:", error);
    //     }
    //   }
    // }

    // if (collaborators && Array.isArray(collaborators)) {
    //   for (const collaboratorData of collaborators) {
    //     const existingCollaborator = await Collaborator.findOne({
    //       where: { tripId: tripId },
    //     });
    //     if (existingCollaborator) {
    //       console.log("updating collaborator");

    //       await existingCollaborator.update(collaboratorData);
    //     }
    //   }
    // }

    res.status(200).json({ message: "Trip updated successfully" });
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
