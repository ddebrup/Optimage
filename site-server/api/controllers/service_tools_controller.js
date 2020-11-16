const request = require("request");
const path = require("path");
const pathToUploads = path.join(__dirname, "../../../uploads");
const s3 = require("../config/aws_s3");
const fs = require("fs");

const storeObjectToS3 = (filePath, key) => {
  return new Promise((resolve, rejects) => {
    const params = {
      Bucket: process.env.AWSBucketName,
      Body: fs.createReadStream(filePath),
      Key: key,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        resolve({ success: false, message: err });
      }
      if (data) {
        resolve({
          success: true,
          message: "Stored in " + data.Location,
          key: key,
        });
      }
    });
  });
};

const requestApi = (reqOptions) => {
  return new Promise((resolve, rejects) => {
    request(reqOptions, (err, res, body) => {
      if (err) {
        rejects(err);
      } else {
        resolve(body);
      }
    });
  });
};

const resizeTool = async (req, res) => {
  try {
    // console.log(req.body);
    const imageName = req.body.unique_id.toString().trim();
    const userDir = req.user.email.toString().trim();
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    const pathOfImage = path.join(pathToUploads, userDir, imageName);
    let data = {
      imagePath: pathOfImage,
      width,
      height,
    };
    const reqOptions = {
      method: "GET",
      url: process.env.ML_API_URL + "/api/resize",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      res.status(200).json(responseFromApi);
    } catch (e) {
      res.status(500).json({ success: false });
    }
  } catch (e) {
    // console.log(e);
    res.status(500).json({ success: false });
  }
};

const huffmanCompression = async (req, res) => {
  try {
    const imageName = req.body.unique_id.toString().trim(); //in body
    const userDir = req.user.email.toString().trim();
    const pathOfImage = path.join(pathToUploads, userDir, imageName);
    let data = {
      imagePath: pathOfImage,
      userDir: path.join(pathToUploads, userDir),
      imageName: imageName,
    };
    // console.log(data);
    const reqOptions = {
      method: "POST",
      url: process.env.ML_API_URL + "/api/huffmanCompression",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      // console.log(responseFromApi);
      const {
        pathOfCompressedImage,
        objectName,
        success,
        dim_val,
      } = responseFromApi;

      if (success == "true") {
        const resS3 = await storeObjectToS3(pathOfCompressedImage, objectName);
        // console.log(resS3);
        if (resS3.success) {
          console.log(dim_val, resS3.key, req.user.email);
          res.status(200).json(resS3);
        }
      } else {
        res.status(500).json({ success: false });
      }
    } catch (e) {
      res.status(500).json({ success: false });
    }
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

module.exports = { resizeTool, huffmanCompression };
