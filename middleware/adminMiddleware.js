const isAdmin = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      const error = new Error("User not authorized. Please log in.");
      error.status = 401;
      return next(error.message);
    }
    const user = req.user;
    if (!user.isAdmin) {
      const error = new Error("User is not an admin.");
      error.status = 403;
      return next(error.message);
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
