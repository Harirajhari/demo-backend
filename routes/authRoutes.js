// Connects each URL to a controller function.

const express = require("express");
const protect = require("../middleware/protect");
const { register, login, logout, getProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);          // public
router.post("/login", login);                // public
router.post("/logout", logout);              // public
router.get("/profile", protect, getProfile); // protected: protect runs first

module.exports = router;
