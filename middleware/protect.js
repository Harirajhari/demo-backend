// Runs BEFORE a controller. It checks that the user is logged in.

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token; // the cookie we set at login

  if (!token) {
    return res.status(401).json({ message: "Please login" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET); // checks the token
    req.userId = data.id;   // save the user id for the controller
    next();                 // go to the controller
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
