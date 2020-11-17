const { fstat } = require("fs");
const path = require("path");
const pathToUploads = path.join(__dirname, "../../../uploads");
const fs = require("fs");
const directDownload = async (req, res) => {
  try {
    const user = req.user.email.toString().trim();
    const filename = req.query.filename.toString().trim();
    const pathOfFile = path.join(pathToUploads, user, filename);
    if (fs.existsSync(pathOfFile)) {
      res.status(200).download(pathOfFile);
    } else {
      res.status(404).json({ success: false, message: "not found" });
    }
  } catch {
    res.status(500).json({ success: false, message: "bad request" });
  }
};

module.exports = { directDownload };
