/**
 * @fileoverview Controller for user authentication operations
 * Handles user signup, login, token rotation, and logout processes.
 */

const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Blocklist = require("../models/blocklist.model");
const RefreshToken = require("../models/refreshToken.model");

// Helper function to generate access and refresh tokens
const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion ?? 0 },
    "SECRET_KEY",
    { expiresIn: "15m" }
  );

  const refreshTokenValue = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  // Store refresh token in db
  await RefreshToken.create({
    token: refreshTokenValue,
    user: user._id,
    expiresAt: expiresAt
  });

  return { accessToken, refreshToken: refreshTokenValue };
};

/**
 * Register a new user
 */
exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, role: role || "user" });
    
    // Generate both tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({ 
      message: "Signup successful", 
      userId: user._id,
      token: accessToken, // Kept for backward compatibility mapping on frontend
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

/**
 * Authenticate an existing user and return tokens
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({ 
      message: "Login successful", 
      token: accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

/**
 * Refresh tokens (Token Rotation)
 */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token is required" });

    // Validate if the refresh token exists in DB
    // If we use JWT for refresh token, we would also verify it here
    const existingToken = await RefreshToken.findOne({ token: refreshToken }).populate("user");
    
    if (!existingToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Checking if the token expired (Though TTL index usually handles this)
    if (new Date() > existingToken.expiresAt) {
      await RefreshToken.findByIdAndDelete(existingToken._id);
      return res.status(403).json({ message: "Refresh token expired" });
    }

    const user = existingToken.user;
    
    // Rotate token: delete the old one
    await RefreshToken.findByIdAndDelete(existingToken._id);

    // Issue a new token pair
    const tokens = await generateTokens(user);

    res.json({
      message: "Token refreshed successfully",
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (err) {
    res.status(500).json({ message: "Token refresh failed", error: err.message });
  }
};

/**
 * Logout user from current device
 */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    // Blocklist the access token
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      await Blocklist.create({
        token: token,
        expiresAt: new Date(decoded.exp * 1000)
      });
    }

    // Delete the refresh token from DB if provided
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

/**
 * Logout user from all devices
 * Increments the user's tokenVersion, which instantly invalidates all
 * existing access tokens. Also wipes all refresh tokens.
 */
exports.logoutAll = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User context missing." });
    }

    // Increment tokenVersion — this makes every previously-issued access token
    // fail the version check in the middleware immediately, even if not expired.
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });

    // Wipe all refresh tokens so they can't be used to get new access tokens either.
    await RefreshToken.deleteMany({ user: req.user.id });

    res.json({ message: "Logged out from all devices" });
  } catch (err) {
    res.status(500).json({ message: "Global logout failed", error: err.message });
  }
};
