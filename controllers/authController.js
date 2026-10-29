// The logic for register, login, logout and profile.

const bcrypt = require("bcryptjs");   // hashing passwords
const jwt = require("jsonwebtoken");  // creating and checking tokens
const User = require("../models/User");

// REGISTER: save a new user with a hashed password
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    // is this email already used?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN: check the password, then give a token inside a cookie
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    // 1. find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Wrong email or password" });
    }
    // 2. compare the typed password with the saved hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong email or password" });
    }
    // 3. create a token that holds the user id (valid for 1 day)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // 4. put the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,                  // JavaScript in the browser cannot read it
      maxAge: 24 * 60 * 60 * 1000,     // 1 day (in milliseconds)
      // secure: true,                 // turn this on when your site uses HTTPS
    });
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT: remove the cookie
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// PROFILE: a protected route (only for logged in users)
const getProfile = async (req, res) => {
  try {
    // req.userId was set by the protect middleware
    const user = await User.findById(req.userId).select("-password"); // hide the hash
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getProfile };
