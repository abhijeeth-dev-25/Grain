/**
 * @fileoverview Authentication routes
 * Maps /api/auth endpoints to the auth controller functions.
 */

const router = require("express").Router();
const { signup, login } = require("../controllers/auth.controller");

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

module.exports = router;
