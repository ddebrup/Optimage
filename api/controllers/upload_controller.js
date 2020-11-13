const s3 = require("../config/aws_s3");
const fs = require("fs");

const imageUploader = async (req, res) => {
  console.log(req.file.path);
  if (req.file) {
    //here we can call flask server api for image
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

const storeObjectToS3 = (filePath) => {
  const params = {
    Bucket: process.env.AWSBucketName,
    Body: fs.createReadStream(filePath),
    Key: "testing.png",
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.log("err");
    }
    if (data) {
      console.log("Uploaded in ", data.Location);
    }
  });
};

const getObjectFromS3 = (key) => {
  const params = {
    Bucket: process.env.AWSBucketName,
    Key: key,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log("failed in getting image with key", key);
    }
    if (data) {
      const base64Data = Buffer.from(data.Body).toString("base64");
      // console.log(base64Data);
    }
  });
};

module.exports = { imageUploader };
