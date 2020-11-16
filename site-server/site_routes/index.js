const { constants } = require("crypto");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("home page here");
});

router.get("/about", (req, res) => {
  res.send("about us here");
});

router.get("stats", (req, res) => {
  res.send("tool statistics will be shown over here");
});

router.get("/signin", (req, res) => {
  res.send("signin page here");
});
router.get("/signup", (req, res) => {
  res.send("signin page here");
});

router.use("/services", require("./services"));

module.exports = router;
