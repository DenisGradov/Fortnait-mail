const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
