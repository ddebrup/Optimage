const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { render } = require("ejs");

let transporter = nodemailer.createTransport({
  service: "google",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.OTPEMAIL,
    pass: process.env.OTPEMAILPASS,
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template", err);
        return;
      }

      mailHTML = template;
    }
  );

  return mailHTML;
};
module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
