const nodemailer = require("nodemailer");

exports.sendEmailWithPassword = async (to, password, name) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const htmlContent = `
    <h2>Hello ${name},</h2>
    <p>You have been registered. Here is your login password:</p>
    <p><strong>${password}</strong></p>
    <p>Please change your password after logging in for the first time.</p>
  `;

  await transporter.sendMail({
    from: `"Your App Name" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: "Your Registration Password",
    html: htmlContent,
  });
};
