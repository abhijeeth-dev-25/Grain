const jwt = require("jsonwebtoken");
const Blocklist = require("../models/blocklist.model");
const User = require("../models/user.model");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // 1. Check blocklist
    const isBlocklisted = await Blocklist.findOne({ token });
    if (isBlocklisted) {
      return res.status(401).json({ message: "Token invalidated" });
    }

    // 2. Verify signature and expiry
    const decoded = jwt.verify(token, "SECRET_KEY");

    // 3. Check tokenVersion — this rejects tokens issued before a "logout all"
    const user = await User.findById(decoded.id).select("tokenVersion role");
    if (!user) return res.status(401).json({ message: "User not found" });

    if ((decoded.tokenVersion ?? 0) !== user.tokenVersion) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Middleware to restrict access to admin users only
 * Requires the `protect` middleware to have run first to populate `req.user`.
 * @function admin
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user details
 * @param {string} req.user.role - The role of the user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() on success, or sends a 403 response on failure
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
