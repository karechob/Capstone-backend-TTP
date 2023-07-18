const express = require("express");
const db = require("./db");
const cors = require("cors");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const crypto = require("crypto");
const User = require("./db/models/user");

const PORT = 8080;
const sessionStore = new SequelizeStore({ db });

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

const configSession = () => ({
  secret: generateSecret(),
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
  },
});

// Middleware setup
const setupMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
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
  await db.sync();
  app.listen(port, () => console.log(`Server is on port:${port}`));
  return app;
};

// Configure all functions in one major function
const configureApp = async (port) => {
  const app = express();
  setupPassport();
  setupMiddleware(app);
  await sessionStore.sync();
  setupRoutes(app);
  return startServer(app, port);
};

configureApp(PORT);
