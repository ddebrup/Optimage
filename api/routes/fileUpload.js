const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload_controller");
const multerStorage = require("../config/multer");

router.post(
  "/image",
  multerStorage.single("file"),
  uploadController.imageUploader
);

module.exports = router;
