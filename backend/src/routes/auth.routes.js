/**
 * @fileoverview Authentication routes
 * Maps /api/auth endpoints to the auth controller functions.
 */

const router = require("express").Router();
const { signup, login, logout } = require("../controllers/auth.controller");
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
 * @route POST /logout
 * @description Logout user and blocklist current token
 * @access Private
 */
router.post("/logout", protect, logout);

module.exports = router;
