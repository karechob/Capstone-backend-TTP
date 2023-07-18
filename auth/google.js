const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../db/models");
require("dotenv").config();

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const username = profile.emails[0].value.split("@")[0]; // Extract username from email

        // Try to find user in the database; if not present, create a new user
        const [user] = await User.findOrCreate({
          where: { googleId },
          defaults: { name, username, email, googleId },
        });

        // Done with no errors and the user
        done(null, user);
      } catch (error) {
        // Error occurred, pass it through
        done(error);
      }
    }
  )
);

// Mounted on auth/google
// auth/google
// Trigger Google OAuth
router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// auth/google/callback
// Google OAuth callback
router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // successful authentication, redirect home
    console.log("Logged in successfully");

    res.redirect("http://localhost:3000/home");
  }
);

module.exports = router;
