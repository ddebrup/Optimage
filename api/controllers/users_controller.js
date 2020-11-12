const User = require("../models/users");
const jwt = require("jsonwebtoken");
const queue = require("../config/kue");
const Otp = require("../models/otp");
let opts = {
  issuer: "accounts.gupta.com",
  expiresIn: "7d",
};

module.exports.signIn = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user && user.otpVerified) {
      console.log("output of user.findone: ", user);

      if (!user || user.password != req.body.password) {
        return res.json(422, {
          message: "Invalid Username / Password",
        });
      }
      const jwtObj = {
        email: user.email,
      };
      return res.json(200, {
        message: "Signed in sucessfully , redirecting to home",
        data: {
          token: jwt.sign(jwtObj, process.env.JWT_SECRET, opts),
        },
        success: true,
      });
    }
    return res.status(400).json({
      message: "Bad request , need to signup ",
    });
  } catch (err) {
    console.log("********", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.signUp = async function (req, res) {
  try {
    
    let user = await User.findOne({ email: req.body.email });
    if (user.otpVerified) {
      if (user.name != "a") {
        return res.status(409).json({
          message: "User already exists",
        });
      }
      if (user.name == "a" && user.password == "a") {
        user.name = req.body.name;
        user.password = req.body.password;
        await user.save();
        return res.status(200).json({
          message: "You have successfully signed up",
          success: true,
        });
      }
    }
    return res.status(400).json({
      message: "please use otp to verify , dont do funny thing",
    });
  } catch (err) {
    console.log("******** userscontroller:", err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
