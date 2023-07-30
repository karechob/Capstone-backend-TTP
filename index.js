const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const crypto = require("crypto");
const User = require("./db/models/user");
require("dotenv").config();

const app = express();

const sessionStore = new SequelizeStore({ db });

const PORT = 8080;

 app.use(bodyParser.json()); 
 app.use(bodyParser.urlencoded({ extended: true }));

 //const sessionStore = new SequelizeStore({ db });

app.get("/", (req, res) => {
  res.send("Express on Vercel 🥳🤩");
});




// Helper functions
const serializeUser = (user, done) => done(null, user.id);
const deserializeUser = async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error("Deserialize User Error:", error);
    done(error);
  }
};

const generateSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

const sessionSecret = process.env.SESSION_SECRET;
const configSession = () => ({
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/",
  },
});

// Middleware setup
const setupMiddleware = (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
      credentials: true,
    })
  );
  app.use(session(configSession()));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    next();
  });

  return app;
};

// Passport Setup
const setupPassport = () => {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

// Routes
const setupRoutes = (app) => {
  app.use("/api", require("./api"));
  app.use("/auth", require("./auth"));
};

// Start server and sync the db
const startServer = async (app, port) => {
  await sessionStore.sync();
  await db.sync({ force: false });
  app.listen(port, () => console.log(`Server is on port:${port}`));
  return app;
};

// Configure all functions in one major function
const configureApp = async (port) => {
  const app = express();
  setupPassport();
  setupMiddleware(app);
  setupRoutes(app);
  return startServer(app, port);
};

configureApp(PORT);

module.exports = express;