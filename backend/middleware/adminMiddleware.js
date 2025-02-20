const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = isAdmin;
