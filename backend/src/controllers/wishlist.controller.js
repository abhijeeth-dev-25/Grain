/**
 * @fileoverview Controller for user wishlist operations
 * Handles adding items to and retrieving items from a user's wishlist.
 */

const User = require("../models/user.model");

/**
 * Adds a course to the authenticated user's wishlist
 * Ensures there are no duplicate entries by verifying before insertion.
 * @function addToWishlist
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.courseId - The ID of the course to be added
 * @param {Object} req.user - Authenticated user details from middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a success message or an error message
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.wishlist.some(w => w.courseId.toString() === courseId)) {
      user.wishlist.push({ courseId });
      await user.save();
    }
    res.json({ message: "Course added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to wishlist" });
  }
};

/**
 * Retrieves the authenticated user's wishlist with populated course details
 * @function getWishlist
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user details from middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with an array of populated course objects or an error message
 */
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist.courseId", "title description imageUrl price");
    res.json(user.wishlist.map(w => w.courseId));
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
};
