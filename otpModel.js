const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  email: {
    type: String,
  },
  code: {
    type: String,
    required: true,
  },
  expireIn: {
    type: String,
    required: true,
  },
});
var Otp = mongoose.model("otp", userSchema);
module.exports = Otp;
