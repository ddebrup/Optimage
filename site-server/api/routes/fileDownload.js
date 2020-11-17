const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/download_controller");

router.get("/", downloadController.directDownload);

module.exports = router;
