const nodeMailer = require("../config/nodemailer");

exports.sendMail = function (data) {
  console.log(data);
  let htmlString = nodeMailer.renderTemplate(data, "/temp.ejs");
  nodeMailer.transporter.sendMail(
    {
      from: process.env.OTPEMAIL,
      to: data.email,
      subject: "Demo Mail",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sendMail function in sending mail :", err);
        return;
      }
      console.log(info);
      return;
    }
  );
};
