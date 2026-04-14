/**
 * @fileoverview Controller for course-related operations
 * Handles CRUD operations and listing of courses.
 */

const Course = require("../models/course.model");

/**
 * Creates a new course entry in the database
 * @function addCourse
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Course title
 * @param {string} req.body.description - Detailed description of the course
 * @param {number} req.body.price - Course price
 * @param {string} req.body.imageUrl - URL to course thumbnail/image
 * @param {Array<Object>} req.body.episodes - List of episodes for the course
 * @param {Object} req.user - Authenticated user details from middleware
 * @param {string} req.user.id - The ID of the authenticated user creating the course
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the created course or an error message
 */
exports.addCourse = async (req, res) => {
  try {
    const { title, description, price, imageUrl, episodes } = req.body;
    const course = await Course.create({
      title, description, price, imageUrl, episodes, createdBy: req.user.id,
    });
    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    res.status(500).json({ message: "Error adding course", error: err.message });
  }
};

/**
 * Retrieves courses created by the currently authenticated admin
 * @function getMyCourses
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {string} req.user.id - The admin's user ID
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with an array of the admin's courses
 */
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your courses", error: err.message });
  }
};

/**
 * Retrieves a list of all courses (optimized for card view)
 * @function getCourses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with an array of course objects
 */
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, "title description price imageUrl createdBy");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

/**
 * Retrieves full details for a specific course by its ID
 * @function getCourseById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request URL parameters
 * @param {string} req.params.id - The ID of the course to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the populated course object or an error message
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "username");
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

/**
 * Searches for courses matching the given name query
 * @function searchCourses
 * @param {Object} req - Express request object
 * @param {Object} req.query - URL query parameters
 * @param {string} [req.query.name] - Partial or full text to search in course titles
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with an array of matching courses or an error message
 */
exports.searchCourses = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    
    const courses = await Course.find({
      $or: [
        { title: { $regex: name, $options: "i" } },
        { description: { $regex: name, $options: "i" } }
      ]
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/**
 * Updates an existing course by its ID
 * @function updateCourse
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request URL parameters
 * @param {string} req.params.id - Group ID to update
 * @param {Object} req.body - Fields to update in the course
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the updated course or an error message
 */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to modify this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Course updated", course: updatedCourse });
  } catch (err) {
    res.status(500).json({ message: "Error updating course", error: err.message });
  }
};

/**
 * Deletes a course by its ID
 * @function deleteCourse
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request URL parameters
 * @param {string} req.params.id - The ID of the course to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a success acknowledgment or an error message
 */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course", error: err.message });
  }
};
