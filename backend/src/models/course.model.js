/**
 * @fileoverview Course mongoose model and schema definition
 */

const mongoose = require("mongoose");

/**
 * Defines the schema for courses in the database.
 * @typedef {Object} CourseSchema
 * @property {string} title - The title of the course (required)
 * @property {string} [description] - A detailed description of the course
 * @property {number} [price] - The cost of the course
 * @property {string} [imageUrl] - URL to a thumbnail/image for the course
 * @property {Array<Object>} episodes - An array of episode objects
 * @property {string} episodes.title - Title of the episode
 * @property {string} episodes.description - Description of the episode
 * @property {string} episodes.videoUrl - URL to the episode's video content
 * @property {string} episodes.imageUrl - URL to the episode's thumbnail image
 * @property {mongoose.Schema.Types.ObjectId} createdBy - Reference to the user who created the course
 * @property {Date} createdAt - Automatically generated timestamp for creation
 * @property {Date} updatedAt - Automatically generated timestamp for updates
 */
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  imageUrl: String,
  episodes: [
    {
      title: String,
      description: String,
      videoUrl: String,
      imageUrl: String,
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

/**
 * Mongoose model for the Course schema
 * @type {mongoose.Model}
 */
module.exports = mongoose.model("Course", courseSchema);
