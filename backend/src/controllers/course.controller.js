const Course = require("../models/course.model");

// Add new course
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

// Show all courses (card view)
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, "title description price imageUrl");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// Show full course details
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("createdBy", "username");
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};

// Search courses
exports.searchCourses = async (req, res) => {
  try {
    const { name } = req.query;
    const courses = await Course.find({ title: { $regex: name, $options: "i" } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: "Error updating course", error: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course", error: err.message });
  }
};
