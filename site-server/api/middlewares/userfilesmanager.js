const path = require("path");
const pathToUploads = path.join(__dirname, "../../../uploads");
const fs = require("fs");

const createUserDir = (name) => {
  return new Promise((resolve, rejects) => {
    name = name.toLowerCase();
    fs.mkdir(path.join(pathToUploads, name), (err) => {
      if (err) {
        console.log("err in creating dir", name);
        resolve({ success: false });
      } else {
        console.log("created", name);
        resolve({ success: true });
      }
    });
  });
};

const checkUserDir = (name) => {
  return new Promise((resolve, rejects) => {
    name = name.toLowerCase();
    fs.access(path.join(pathToUploads, name), async (err) => {
      if (err) {
        console.log("dir does not exist...creating");
        const { success } = await createUserDir(name);
        resolve({ success: success });
      } else {
        console.log("present");
        resolve({ success: true });
      }
    });
  });
};

const manageUserUploads = async (req, res, next) => {
  const name = req.user.email;
  const { success } = await checkUserDir(name);
  if (success) {
    req.uploadPath = path.join(pathToUploads, name);
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "err in creating dir",
    });
  }
};

module.exports = manageUserUploads;
