const express = require("express");
const router = express.Router();
const cookieAuthMiddleware = require("../site-middlewares/jwt-cookie-authentication");

router.get("/", (req, res) => {
  res.send("sevices page will be displayed here");
});

// this can be used after authentication

router.get("/compress", cookieAuthMiddleware, (req, res) => {
  res.send("reached tools page");
});

module.exports = router;
