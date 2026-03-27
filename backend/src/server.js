/**
 * @fileoverview Main application entry point
 * Configures Express app, initializes middleware, registers routes, and connects to DB.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();

/**
 * System Middleware
 */
app.use(express.json());
app.use(cors());

/**
 * Application Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/profile", profileRoutes);

/**
 * Root sanity check route
 * @route GET /
 * @access Public
 */
app.get("/", (req, res) => {
  res.send("Welcome to the EduApp API");
});

/**
 * Database Connection & Server Initialization
 */
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/eduapp")
  .then(() => app.listen(3231, () => console.log("✅ Server running on port 3230")))
  .catch(err => console.error("MongoDB connection failed", err));
