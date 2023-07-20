const isAdmin = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "User not authorized" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      res.status(403).json({ error: "User is not an admin." });
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
