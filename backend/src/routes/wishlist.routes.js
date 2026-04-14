/**
 * @fileoverview Wishlist routes
 * Maps /api/wishlist endpoints to the wishlist controller functions.
 */

const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlist.controller");

/**
 * @route POST /add
 * @description Add a specific course to the active user's wishlist
 * @access Private
 */
router.post("/add", protect, addToWishlist);

/**
 * @route GET /
 * @description Fetch the courses on the active user's wishlist
 * @access Private
 */
router.get("/", protect, getWishlist);

/**
 * @route DELETE /:courseId
 * @description Remove a specific course from the active user's wishlist
 * @access Private
 */
router.delete("/:courseId", protect, removeFromWishlist);

module.exports = router;
