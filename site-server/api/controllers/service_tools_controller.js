const request = require("request");
const path = require("path");
const pathToUploads = path.join(__dirname, "../../../uploads");

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

module.exports = { resizeTool };
