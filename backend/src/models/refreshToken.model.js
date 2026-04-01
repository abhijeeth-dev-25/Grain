/**
 * @fileoverview Refresh Token model for managing long-lived authentication sessions
 * Stores refresh tokens associated with users for secure token rotation.
 */

const mongoose = require("mongoose");

/**
 * Defines the schema for refresh tokens in the database.
 * @typedef {Object} RefreshTokenSchema
 * @property {string} token - The unique refresh token string
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the user who owns this token
 * @property {Date} expiresAt - Expiration date of the refresh token
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // This tells MongoDB to delete the document exactly at the `expiresAt` date
  },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
