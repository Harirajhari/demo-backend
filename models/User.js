// What a user looks like in MongoDB.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // this stores the HASH, not the real password
});

module.exports = mongoose.model("User", userSchema);
