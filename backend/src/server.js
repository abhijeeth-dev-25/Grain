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

const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

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
 * Server Initialization
 */
const PORT = process.env.PORT || 3231;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
