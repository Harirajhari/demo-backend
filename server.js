const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);





// Main file: sets up Express, connects to MongoDB, then starts the server.

require("dotenv").config(); // reads the .env file
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

if (!process.env.JWT_SECRET) {
  console.log("JWT_SECRET is missing in the .env file");
  process.exit(1);
}

const app = express();

// allow the React app to call this API and send cookies
app.use(cors(
  { origin: "http://localhost:5173",
     credentials: true 
  }));

  
app.use(express.json());   // read JSON from the request body
app.use(cookieParser());   // read cookies (needed for req.cookies)

app.get("/", (req, res) => {
  res.send("Auth API is running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  })
  .catch((err) => {
    console.log("DB connection failed: " + err.message);
  });
