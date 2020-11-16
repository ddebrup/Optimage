const queue = require("../config/kue");
const OtpMailer = require("../mailers/otp_mailer");
const Otp = require("../models/otp");
const otpWorker = require("../worker/otp_worker");
// const Users = require('../models/users');
const User = require("../models/users");
const TIME_TO_WAIT = 600;

module.exports.generate = async function (req, res) {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      message: "you are already registered ",
    });
  }
  let otp = await Otp.findOneAndUpdate(
    { email: req.body.email },
    { otp: generateOTP() },
    {
      new: true,
      upsert: true,
    }
  );
  console.log(otp.email, otp.otp);

  let job = await queue.create("otpmailer", otp).save(function (err) {
    if (err) {
      console.log("error in creating a job : ", err);
      return;
    }
    console.log("queue created with :", job.id);
  });
  return res.status(200).json({
    message: "mail sent successfully",
    success: true,
  });
};

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports.verify = async function (req, res) {
  let otp = await Otp.findOne({ email: req.body.email });
  if (!otp) {
    return res.status(400).json({
      message: "Bad request , no such otp created ",
    });
  }
  // console.log(otp);
  let date = new Date(otp.updatedAt);
  date = date.getTime() / 1000;
  let currentDate = Date.now() / 1000;
  if (currentDate > date + TIME_TO_WAIT) {
    return res.status(408).json({
      message: "request timed out , send another otp ",
    });
  }
  if (otp.otp == req.body.otp) {
    let user = await User.findOne({ email: req.body.email });
    console.log("user:", user);
    if (!user) {
      console.log("***********creating user");
      await User.create({
        email: req.body.email,
        name: "a",
        password: "a",
        otpVerified: true,
      });
    }
    return res.status(200).json({
      message: "Otp has been verified, you can signup now :)",
      user: user,
      success: true,
    });
  } else {
    return res.status(422).json({
      message: "wrong otp",
    });
  }
};
