/**
 * @fileoverview Blocklist model for invalidated JWT tokens
 * Stores tokens that have been logged out before their natural expiration.
 * MongoDB automatically deletes documents when their `expiresAt` time is reached.
 */

const mongoose = require("mongoose");

const blocklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // This tells MongoDB to delete the document exactly at the `expiresAt` date
  },
});

module.exports = mongoose.model("Blocklist", blocklistSchema);
