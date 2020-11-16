module.exports.home = function (req, res) {
  console.log("heree in home", req.user.email);
  return res.json(200, {
    message: "token valid",
    initial: req.user.email.slice(0, 1),
    success: true,
  });
};
