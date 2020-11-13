const express = require("express");
const app = express();
const limiter = require("express-rate-limit");
// const cors = require("cors");
require("dotenv").config();
const path = require("path");
const port = process.env.PORT;
const bodyParser = require("body-parser");
const db = require("./api/config/mongoose");
const passport = require("passport");
const passportJWT = require("./api/config/passport-jwtStrategy");

//path to views
const pathToViews = path.join(__dirname, "templates/views");

//temp parts

const pathToTemp = path.join(__dirname, "temp");

//config
app.use(express.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());
app.set("view engine", "ejs");

//setting a custom limit to api for calls restriction
const customApiLimit = limiter({
  windowMs: 500,
  max: 3,
});
app.set("views", pathToViews);

// index routes
app.use("/api", customApiLimit);
app.use("/api", require("./api/routes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "server up...check apis" });
});
app.use("/test", express.static(pathToTemp));

app.listen(port, function (err) {
  if (err) {
    console.log(`error in listening: ${err}`);
  }
  console.log("click here", `http://localhost:${port}`);
});
