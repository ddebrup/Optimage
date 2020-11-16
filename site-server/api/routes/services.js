const express = require("express");
const router = express.Router();
const serviceToolsController = require("../controllers/service_tools_controller");

router.post("/resize", serviceToolsController.resizeTool);

router.post("/huffman-compression", serviceToolsController.huffmanCompression);

module.exports = router;
