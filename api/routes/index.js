const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");
const passport = require("passport");
const queue = require("../config/kue");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  homeController.home
);

router.use("/sign-in", require("./sign-in"));
router.use("/sign-up", require("./sign-up"));
router.use("/otp", require("./otp"));
router.use("/upload",require("./fileUpload"));



module.exports = router;
