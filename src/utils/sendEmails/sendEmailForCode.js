const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

module.exports = async function sendEmail(to, code) {
  await transporter.sendMail({
    from: `"No Reply" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  });
};
