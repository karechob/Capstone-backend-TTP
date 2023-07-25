const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ error: "User not authorized" });
  }
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ error: "User not authenticated. Please log in." });
  }
};

module.exports = { isAuthorized, isAuthenticated };
