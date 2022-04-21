const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  //secure: true,
  auth: {
    user: "attechteam12@gmail.com",
    pass: "N9IOQqtxT8gyjbS7",
  },
});

module.exports = { transporter };
