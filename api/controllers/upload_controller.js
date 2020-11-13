const imageUploader = async (req, res) => {
  if (req.file) {
    res.status(200).json({
      success: true,
      message: "reached",
    });
    console.log("success in saving file");
  } else {
    res.status(500).json({
      success: false,
      message: "reached",
    });
    console.log("err in saving file");
  }
};

module.exports = { imageUploader };
