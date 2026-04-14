/**
 * @fileoverview Controller for user profile operations
 * Handles fetching generic profile details for the authenticated user.
 */

const User = require("../models/user.model");

/**
 * Retrieves the profile data of the currently authenticated user
 * @function getProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user details from middleware
 * @param {string} req.user.id - The ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with basic user profile details (username, email) or an error message
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

/**
 * Updates the profile data of the currently authenticated user
 * @function updateProfile
 * @param {Object} req - Express request object
 * @param {Object} req.body - Fields to update (username, email)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a success message and updated user
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("username email");
    
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};
