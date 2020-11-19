const express = require("express");
const router = express.Router();
const path = require("path");
const pathToSignin = path.join(__dirname, "static_serving_pages", "signin");
const pathToSignup = path.join(__dirname, "static_serving_pages", "signup");
const pathToHome = path.join(__dirname, "static_serving_pages", "home");
const pathToAbout = path.join(__dirname, "static_serving_pages", "about");
const pathToGallery = path.join(__dirname, "static_serving_pages", "gallery");

router.use("/", express.static(pathToHome));

router.use("/about", express.static(pathToAbout));

router.use("/gallery", express.static(pathToGallery));

router.use("/signin", express.static(pathToSignin));
router.use("/signup", express.static(pathToSignup));

router.use("/services", require("./services"));

module.exports = router;
