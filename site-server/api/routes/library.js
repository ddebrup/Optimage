const express = require("express");
const router = express.Router();
const libController = require("../controllers/userLibrary_controller");

router.get("/allObjects", libController.getAllObjects);

router.post("/getAnObject", libController.objectDownloader);
module.exports = router;
