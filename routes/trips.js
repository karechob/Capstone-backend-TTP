const express = require("express");
const router = require("express").Router();
const { Trips } = require("../db/models/hotel");

// Fetch all Trips DONE
router.get("/", async (req, res, next) => {
  try {
    console.log("getting all Trips");
    const allTrips = await Hotel.findAll();
    console.log(allTrips);

    allTrips
      ? res.status(200).json(allTrips)
      : res.status(404).send("No Trips found");
  } catch (error) {
    console.log("the error we're stuck on: ", error);
  }
});
