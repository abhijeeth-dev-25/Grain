/**
 * @fileoverview Authentication routes
 * Maps /api/auth endpoints to the auth controller functions.
 */

const router = require("express").Router();
const { signup, login, logout, refresh, logoutAll } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

/**
 * @route POST /signup
 * @description Register a new user
 * @access Public
 */
router.post("/signup", signup);

/**
 * @route POST /login
 * @description Authenticate user & get token
 * @access Public
 */
router.post("/login", login);

/**
 * @route POST /refresh
 * @description Refresh access token using refresh token
 * @access Public
 */
router.post("/refresh", refresh);

/**
 * @route POST /logout
 * @description Logout user from current device
 * @access Private
 */
router.post("/logout", protect, logout);

/**
 * @route POST /logout-all
 * @description Logout user from all devices
 * @access Private
 */
router.post("/logout-all", protect, logoutAll);

/**
 * @route GET /verify
 * @description Lightweight heartbeat to validate that the current session is still active.
 * Returns 200 if the token is valid, or 401 if it has been invalidated (e.g. by logoutAll).
 * @access Private
 */
router.get("/verify", protect, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
