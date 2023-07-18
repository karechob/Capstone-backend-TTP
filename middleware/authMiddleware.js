const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const error = new Error("User not authorized. Please log in.");
    error.status = 401;
    return next(error.message);
  }
};

module.exports = isAuthorized;
