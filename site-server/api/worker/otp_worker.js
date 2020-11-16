const queue = require("../config/kue");
const otpMailer = require("../mailers/otp_mailer");
const testMailer = require("../mailers/test_data_mailer");
queue.process("otpmailer", function (job, done) {
  console.log("email worker is running ", job.data);
  otpMailer.sendMail(job.data);
  done();
});

queue.process("testmailer", function (job, done) {
  console.log("email worker is running ", job.data);
  testMailer.sendMail(job.data);
  done();
});
