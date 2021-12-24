require("dotenv").config();
const express = require("express");
var fs = require("fs");
const path = require("path");
const multer = require("multer");
const app = express();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Otp, User, Contact, Video } = require("../Model");
const { isValidObjectId } = require("mongoose");
const nodemailer = require("nodemailer");

// this route use for register the record

exports.register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.mobileNumber = req.body.mobileNumber;
    user.password = hash;
    const token = await user.ganerateAuthToken();
    console.log(token);
    user.save(function (err) {
      res.json({
        message: "Record Registerd Successfully",
        data: user,
      });
    });
  } catch (error) {
    res.json({
      message: "Error find in when registerd the record",
    });
  }
};

// this route use for login

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        message: "You successfully login",
        data: user,
      });
    } else {
      res.json({
        message: "Invalid Password Details",
      });
    }
  } catch (error) {
    return res.send(error);
  }
};

exports.UserByID = async (req, res) => {
  const view = await User.findOne({ _id: req.params.id });
  if (view) {
    res.json({
      message: "You successfully find the data",
      data: view,
    });
  } else {
    res.json({
      message: "Invalid Id",
    });
  }
};

exports.UpdateProfile = async (req, res) => {
  const { name, email, mobileNumber, Image } = req.body;
  try {
    const update = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      mobileNumber,
      Image,
    });
    if (update) {
      res.json({
        message: "user update successfully",
        data: update,
      });
    } else {
      res.json({
        message: "user not update",
      });
    }
  } catch (error) {}
};

exports.mailSend = async (req, res) => {
  const { email } = req.body;
  if (email === "") {
    res.status(500).json({ msg: "Email is required" });
  } else {
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        let otpData = new Otp({
          email,
          code: Math.floor(100000 + Math.random() * 900000),
          expireIn: new Date().getTime() + 300 * 1000,
        });

        let optResponse = await otpData.save();
        mailer(email, otpData.code);
        return res.status(200).json({ msg: "OTP sended to your mail" });
      } else {
        return res.status(400).json({ errors: [{ msg: "Email not exist" }] });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ errors: error });
    }
  }
};

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shadabakhtar476@gmail.com",
      pass: "razaraza",
    },
  });
  var mailOptions = {
    from: "shadabakhtar476@gmail.com",
    to: email,
    subject: "OTP mail",
    text: otp,
  };
  mailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.changePassword = async (req, res) => {
  var { email, code } = req.body;
  let otp = await Otp.find({ email: email, code: code });
  if (otp) {
    let currentTime = new Date().getTime();
    let diff = otp.expireIn - currentTime;
    if (diff < 0) {
      return res.status(400).json({ errors: [{ msg: "Token expire" }] });
    } else {
      var email = req.body.email;
      let user = await User.findOne({ email });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
      user.save();
      return res.status(200).json({ msg: "Password changes successfully" });
    }
  } else {
    return res.status(400).json({ errors: [{ msg: "Token Expired" }] });
  }
};

// for Contact Us

exports.contact = async (req, res) => {
  try {
    var contact = new Contact();
    contact.Name = req.body.Name;
    contact.email = req.body.email;
    contact.subject = req.body.subject;
    contact.message = req.body.message;
    contact.save(function (err) {
      res.json({
        message: "Contact Registerd Successfully",
        data: contact,
      });
    });
  } catch (error) {
    res.json({
      message: "Error find in when registerd the record",
    });
  }
};

// addVideo

exports.uploadVideo = async (req, res) => {
  try {
    var video = new Video();
    video.Videotype = req.body.Videotype;
    video.videoname = req.body.videoname;
    video.authorname = req.body.authorname;
    video.video = req.file.path;
    video.save(function (err) {
      res.json({
        message: "video uploaded Successfully",
        data: video,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error find in when uploded the video",
    });
  }
};

exports.getallVideo = async (req, res) => {
  try {
    const getallVideo = await Video.find({});
    return res.status(200).json(getallVideo);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.videodeletebyID = async (req, res) => {
  try {
    const deletebyid = await Video.deleteOne({ _id: req.params.id });
    return res.status(200).json(deletebyid);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.updatevideo = async (req, res) => {
  const { Videotype, videoname, authorname, video } = req.body;
  try {
    console.log(req.params.id);
    const update = await Video.findByIdAndUpdate(req.params.id, {
      Videotype,
      videoname,
      authorname,
      video,
    });
    return res.status(200).json(update);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.newPassword = async (req, res) => {
  var email = req.body.email;
  let user = await User.find({ email: email });
  if (user) {
    var email = req.body.email;
    let user = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    user.password = hash;
    user.save();
    return res.status(200).json({ msg: "Password changes successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Password Not Change" }] });
  }
};
