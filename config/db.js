// Connects to MongoDB using MONGO_URI from the .env file.

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
};

module.exports = connectDB;
