const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 25,
  secure: false, // важливо: secure повинен бути false, якщо ви використовуєте порт 25
  tls: {
    rejectUnauthorized: false,
  },
});

const mailOptions = {
  from: "admin@kvantomail.com",
  to: "varonapika@gmail.com",
  subject: "Test Email",
  text: "This is a test email from nodemailer.",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log("Error sending email: ", error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
