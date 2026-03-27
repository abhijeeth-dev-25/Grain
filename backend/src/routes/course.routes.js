/**
 * @fileoverview Course routes
 * Maps /api/courses endpoints to the course controller functions.
 */

const router = require("express").Router();
const { protect, admin } = require("../middleware/auth.middleware");
const { addCourse, getCourses, getCourseById, searchCourses, updateCourse, deleteCourse } = require("../controllers/course.controller");

/**
 * @route POST /add
 * @description Add a new course
 * @access Private (Admin only)
 */
router.post("/add", protect, admin, addCourse);

/**
 * @route GET /
 * @description Retrieve all courses (card view mode)
 * @access Public
 */
router.get("/", getCourses);

/**
 * @route GET /search
 * @description Search across courses by name/title
 * @access Public
 */
router.get("/search", searchCourses);

/**
 * @route GET /:id
 * @description Retrieve specific course details by ID
 * @access Public
 */
router.get("/:id", getCourseById);

/**
 * @route PUT /:id
 * @description Update specific course by ID
 * @access Private (Admin only)
 */
router.put("/:id", protect, admin, updateCourse);

/**
 * @route DELETE /:id
 * @description Delete specific course by ID
 * @access Private (Admin only)
 */
router.delete("/:id", protect, admin, deleteCourse);

module.exports = router;
