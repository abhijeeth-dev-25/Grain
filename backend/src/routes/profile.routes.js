/**
 * @fileoverview Profile routes
 * Maps /api/profile endpoints to the profile controller functions.
 */

const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

/**
 * @route GET /
 * @description Retrieve the currently authenticated user's profile
 * @access Private
 */
router.get("/", protect, getProfile);

/**
 * @route PUT /
 * @description Update the currently authenticated user's profile
 * @access Private
 */
router.put("/", protect, updateProfile);

module.exports = router;
