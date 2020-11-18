const request = require("request");
const path = require("path");
const pathToUploads = path.join(__dirname, "../../../uploads");
const s3 = require("../config/aws_s3");
const fs = require("fs");
const s3CompressionModelHuffman = require("../models/userS3ObjectsHuffman");

const getObjectFromS3 = (key, userDir) => {
  return new Promise((resolve, rejects) => {
    try {
      const params = {
        Bucket: process.env.AWSBucketName,
        Key: key,
      };
      const fileName = path.join(pathToUploads, userDir, key);

      let readstream = s3.getObject(params).createReadStream();
      let writeStream = fs.createWriteStream(fileName);
      readstream.pipe(writeStream);
      writeStream.on("finish", () => {
        resolve({ success: true });
      });
    } catch {
      resolve({ success: false });
    }
  });
};

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
        console.log(resS3);
        if (resS3.success) {
          // console.log(dim_val, resS3.key, req.user.email);
          const userKeys = await s3CompressionModelHuffman.findOne({
            email: req.user.email,
          });
          if (!userKeys) {
            const modelobj = {
              email: req.user.email,
              objectKeys: [{ keyValue: resS3.key, dim_val: dim_val }],
            };
            const modelInstance = new s3CompressionModelHuffman(modelobj);
            await modelInstance.save((err) => {
              if (err) {
                res.status(400).json({
                  success: false,
                });
              } else {
                res.status(200).json({
                  success: true,
                  key: resS3.key,
                });
              }
            });
          } else {
            let preExistingKey = false;
            userKeys.objectKeys.forEach((key) => {
              if (key.keyValue == resS3.key) {
                preExistingKey = true;
              }
            });
            if (preExistingKey) {
              res.status(400).json({
                success: false,
                message:
                  "try uploading again ... You are using explicit api to upload thats why same timestamp",
              });
            } else {
              userKeys.objectKeys.push({
                keyValue: resS3.key,
                dim_val: dim_val,
              });
              userKeys.save((err) => {
                if (err) {
                  console.log(err);
                  res.status(400).json({ success: false });
                } else {
                  res.status(200).json({
                    success: true,
                    key: resS3.key,
                  });
                }
              });
            }
          }
          // console.log(userKeys);
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

const huffmanDecompression = async (req, res) => {
  try {
    const userDir = req.user.email.toString().trim();
    const objKey = req.body.objKey.toString().trim();
    const userHuffmanCompressedData = await s3CompressionModelHuffman.findOne({
      email: userDir,
    });
    let found,
      dim = null;
    userHuffmanCompressedData.objectKeys.forEach((obj) => {
      if (obj.keyValue == objKey) {
        found = true;
        dim = obj.dim_val;
      }
    });
    if (found) {
      const { success } = await getObjectFromS3(objKey, userDir);
      if (success) {
        let data = {
          huff_path: path.join(pathToUploads, userDir, objKey),
          filename: objKey,
          dim_val: dim,
          out_dir_path: path.join(pathToUploads, userDir),
        };
        // console.log(data);
        const reqOptions = {
          method: "POST",
          url: process.env.ML_API_URL + "/api/huffmanDecompression",
          headers: {
            Accept: "application/json",
          },
          json: JSON.stringify(data),
        };
        const responseFromApi = await requestApi(reqOptions);
        console.log(responseFromApi);
        if (responseFromApi.success == "true") {
          res
            .status(200)
            .json({ fileName: responseFromApi.name, success: true });
        } else {
          res.status(500).json({ success: false });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "NO OBJECT IN STORE",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "NO OBJECT IN STORE",
      });
    }
  } catch {
    res.status(500).json({
      success: false,
      message: "Uknownerr check logs",
    });
  }
};

const PCACompression = async (req, res) => {
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
      url: process.env.ML_API_URL + "/api/PCACompression",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      console.log(responseFromApi);
      res.status(200).json(responseFromApi);
    } catch {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
};

const medianCut = async (req, res) => {
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
      url: process.env.ML_API_URL + "/api/medianCut",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      console.log(responseFromApi);
      res.status(200).json(responseFromApi);
    } catch {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
};
const dctCompression = async (req, res) => {
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
      url: process.env.ML_API_URL + "/api/dctCompression",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      console.log(responseFromApi);
      res.status(200).json(responseFromApi);
    } catch {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
};

const kmeansCompressionOneway = async (req, res) => {
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
      url: process.env.ML_API_URL + "/api/kmeansCompressionOneway",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    try {
      const responseFromApi = await requestApi(reqOptions);
      console.log(responseFromApi);
      res.status(200).json(responseFromApi);
    } catch {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
};

const knnCompression = async (req, res) => {
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
      url: process.env.ML_API_URL + "/api/knnCompression",
      headers: {
        Accept: "application/json",
      },
      json: JSON.stringify(data),
    };
    const responseFromApi = await requestApi(reqOptions);
    console.log(responseFromApi);
    if (responseFromApi.success == "true") {
      const resS3 = await storeObjectToS3(
        responseFromApi.pathOfObject,
        responseFromApi.objectName
      );
      console.log(resS3);
      if (resS3.success) {
        res.status(200).json({
          success: true,
          objKey: resS3.key,
        });
      } else {
        res.status(500).json({ success: false });
      }
    } else {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
};
const knnDecompression = async (req, res) => {
  try {
    const userDir = req.user.email.toString().trim();
    const objKey = req.body.objKey.toString().trim();
    const { success } = await getObjectFromS3(objKey, userDir);
    if (success) {
      let data = {
        npzPath: path.join(pathToUploads, userDir, objKey),
        userDir: path.join(pathToUploads, userDir),
        fileName: objKey,
      };
      // console.log(data);
      const reqOptions = {
        method: "POST",
        url: process.env.ML_API_URL + "/api/knnDecompression",
        headers: {
          Accept: "application/json",
        },
        json: JSON.stringify(data),
      };
      const responseFromApi = await requestApi(reqOptions);
      res.send(responseFromApi);
    }
  } catch {
    res.status(404).json({ success: false });
  }
};
module.exports = {
  resizeTool,
  huffmanCompression,
  huffmanDecompression,
  PCACompression,
  medianCut,
  dctCompression,
  kmeansCompressionOneway,
  knnCompression,
  knnDecompression,
};
