/**
 * @fileoverview User mongoose model and schema definition
 */

const mongoose = require("mongoose");

/**
 * Defines the schema for users in the database.
 * @typedef {Object} UserSchema
 * @property {string} username - User's chosen display name (required)
 * @property {string} email - Unique email address for the user (required)
 * @property {string} password - Hashed password for authentication (required)
 * @property {string} role - The user's role ("user" or "admin", default: "user")
 * @property {Array<Object>} wishlist - List of courses the user wants to take
 * @property {mongoose.Schema.Types.ObjectId} wishlist.courseId - Reference to the course
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  wishlist: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    }
  ],
});

/**
 * Mongoose model for the User schema
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("User", userSchema);
