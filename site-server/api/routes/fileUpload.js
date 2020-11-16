const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload_controller");
const multerStorage = require("../config/multer");
const userFilesManager = require("../middlewares/userfilesmanager");

router.post(
  "/image",
  userFilesManager,
  multerStorage.single("file"),
  uploadController.imageUploader
);

module.exports = router;
