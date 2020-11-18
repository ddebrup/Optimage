const fs = require("fs");
const s3 = require("../config/aws_s3");
const path = require("path");
const request = require("request");
const userLibModel = require("../models/userLibrary");
const pathToUploads = path.join(__dirname, "../../../uploads");
const s3CompressionModelHuffman = require("../models/userS3ObjectsHuffman");

const knnDecompression = async (objKey, userDir, ext) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const { success } = await getObjectFromS3(objKey, userDir);
      if (success) {
        let data = {
          npzPath: path.join(pathToUploads, userDir, objKey),
          userDir: path.join(pathToUploads, userDir),
          fileName: objKey,
          ext,
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
        if (responseFromApi.success == "true") {
          resolve({ success: true, fileName: responseFromApi.output_name });
        } else {
          resolve({ success: false });
        }
      }
    } catch {
      resolve({ success: false });
    }
  });
};

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
    } catch (e) {
      console.log(e);
      resolve({ success: false });
    }
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

const huffmanDecompression = async (objKey, userDir, ext) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const userHuffmanCompressedData = await s3CompressionModelHuffman.findOne(
        {
          email: userDir,
        }
      );
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
            ext,
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
            resolve({ fileName: responseFromApi.name, success: true });
          } else {
            resolve({ success: false });
          }
        } else {
          resolve({
            success: false,
            message: "NO OBJECT IN STORE",
          });
        }
      } else {
        resolve({
          success: false,
          message: "NO OBJECT IN STORE",
        });
      }
    } catch {
      resolve({
        success: false,
        message: "Uknownerr check logs",
      });
    }
  });
};

const getAllObjects = async (req, res) => {
  const email = req.user.email;
  const userLib = await userLibModel.findOne({ email: email });
  //   console.log(userLib);
  let resArr = [];
  if (!userLib) {
    res.status(200).json({
      success: true,
      message: "No Objects in gallery",
    });
  } else {
    const ObjectsArr = userLib.objectKeys;
    if (ObjectsArr.length == 0) {
      res.status(200).json({
        success: true,
        message: "No Objects in gallery",
      });
    } else {
      ObjectsArr.forEach((obj) => {
        resArr.push(obj.objKey);
      });
      res.status(200).json({
        success: true,
        data: resArr,
      });
    }
  }
};

const objectDownloader = async (req, res) => {
  const email = req.user.email;
  const objKey = req.body.objKey.toString().trim();
  const userLib = await userLibModel.findOne({ email: email });
  if (!userLib) {
    res.status(404).json({
      success: false,
      message: "No Objects in gallery",
    });
  } else {
    let objData;
    userLib.objectKeys.forEach((obj) => {
      if (obj.objKey == objKey) {
        objData = obj;
      }
    });
    if (objData) {
      objData = objData.toObject();
      //   console.log(objData);

      if (objData.decompressionReq) {
        if (objData.algorithmUsed == "Huffman") {
          const { success, fileName } = await huffmanDecompression(
            objData.objKey,
            email,
            objData.extension
          );
          if (success) {
            res.status(200).json({
              success: true,
              fileName: fileName,
            });
          } else {
            res.status(500).json({ success: false });
          }
        }
        if (objData.algorithmUsed == "KmeansCompression") {
          const { success, fileName } = await knnDecompression(
            objData.objKey,
            email,
            objData.extension
          );
          if (success) {
            res.status(200).json({
              success: true,
              fileName: fileName,
            });
          } else {
            res.status(500).json({ success: false });
          }
        }
      } else {
        const { success } = await getObjectFromS3(objData.objKey, email);
        if (success) {
          res.status(200).json({
            success: true,
            fileName: objData.objKey,
          });
        } else {
          res.status(500).json({ success: false });
        }
      }
    } else {
      res.status(404).json({
        success: false,
        message: "No Object in gallery",
      });
    }
  }
};

module.exports = { getAllObjects, objectDownloader };
