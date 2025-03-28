const nodemailer = require("nodemailer");
const { email, pass } = require("../config/configuration");

function sendEmail(toEmail, item) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: pass,
    },
  });

  let mailOptions = {
    from: email,
    to: toEmail,
    subject: "New Item Created",
    text: `Log Entry: ${JSON.stringify(item)}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log("kk");

    if (error) {
      console.error("Error in sendMail callback:", error);
    } else {
      console.log("Email sent successfully!", info.response);
    }
  });
}

module.exports = { sendEmail };
