const jwt = require("jsonwebtoken");
const getCookie = require("./cookie-handler");
const verifyToken = (token) => {
  return new Promise(async (resolve, rej) => {
    try {
      const res = await jwt.verify(token, process.env.JWT_SECRET);
      resolve({ result: res, success: true });
    } catch {
      resolve({ result: "Please authenticate", success: false });
    }
  });
};
const authMiddUser = async (req, res, next) => {
  const authHeaders = getCookie(req).access_token;
  // console.log(authHeaders);
  if (authHeaders) {
    const resFromJwt = await verifyToken(authHeaders.trim());
    // console.log(resFromJwt);
    if (resFromJwt.success) {
      req.user = resFromJwt.result.email;
      next();
    } else {
      res.redirect("/signin");
    }
  } else {
    res.redirect("/signin");
  }
};

module.exports = authMiddUser;
