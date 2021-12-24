const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    Image: {
      type: String,
    },
    tokens: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.set("validateBeforeSave", false);
userSchema.path("email").validate(() => {
  return false;
}, "Email Already exists");

userSchema.methods.ganerateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = token;
    await this.save();
    return token;
  } catch (error) {
    console.log(`the error part ${error}`);
  }
};

// validate Password
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("in catch of validpassword");
    console.log(error);
    throw error;
  }
};
var User = mongoose.model("user", userSchema);
module.exports = User;
