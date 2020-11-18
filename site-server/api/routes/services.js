const express = require("express");
const router = express.Router();
const serviceToolsController = require("../controllers/service_tools_controller");

router.post("/resize", serviceToolsController.resizeTool);

router.post("/huffman-compression", serviceToolsController.huffmanCompression);

router.post(
  "/huffman-decompression",
  serviceToolsController.huffmanDecompression
);

router.post("/PCACompression", serviceToolsController.PCACompression);

router.post("/medianCut", serviceToolsController.medianCut);

router.post("/dctCompression", serviceToolsController.dctCompression);

router.post(
  "/kmeansCompressionOneway",
  serviceToolsController.kmeansCompressionOneway
);

router.post("/knnCompression", serviceToolsController.knnCompression);
router.post("/knnDecompression", serviceToolsController.knnDecompression);

module.exports = router;
