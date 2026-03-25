const router = require("express").Router();
const { protect, admin } = require("../middleware/auth.middleware");
const { addCourse, getCourses, getCourseById, searchCourses, updateCourse, deleteCourse } = require("../controllers/course.controller");

router.post("/add", protect, admin, addCourse);
router.get("/", getCourses);
router.get("/search", searchCourses);
router.get("/:id", getCourseById);
router.put("/:id", protect, admin, updateCourse);
router.delete("/:id", protect, admin, deleteCourse);

module.exports = router;
