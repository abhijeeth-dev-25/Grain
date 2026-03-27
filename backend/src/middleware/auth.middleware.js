/**
 * @fileoverview Authentication middleware for securing routes
 * Provides functions to verify JWTs and check user roles.
 */

const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes that require authentication
 * Verifies the JWT token from the Authorization header and attaches the decoded user to the request.
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} [req.headers.authorization] - Bearer token for authentication
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() on success, or sends a 401 response on failure
 */
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
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
