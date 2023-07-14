const express = require("express");
const router = require("express").Router();
const { Hotel } = require("../db/models/hotel");

// Fetch all hotels DONE
router.get("/", async (req, res, next) => {
  try {
    console.log("getting all hotels");
    const allHotels = await Hotel.findAll();
    console.log(allHotels);

    allHotels
      ? res.status(200).json(allHotels)
      : res.status(404).send("No hotels found");
  } catch (error) {
    console.log("the error we're stuck on: ", error);
  }
});
