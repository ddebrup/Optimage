const express = require("express");
const router = express.Router();
const path = require("path");
const pathToSignin = path.join(__dirname, "static_serving_pages", "signin");
const pathToSignup = path.join(__dirname, "static_serving_pages", "signup");

router.get("/", (req, res) => {
  res.send("home page here");
});

router.get("/about", (req, res) => {
  res.send("about us here");
});

router.get("stats", (req, res) => {
  res.send("tool statistics will be shown over here");
});

router.use("/signin", express.static(pathToSignin));
router.use("/signup", express.static(pathToSignup));

router.use("/services", require("./services"));

module.exports = router;
