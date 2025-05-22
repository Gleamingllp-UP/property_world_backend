// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.NODEMAILER_HOST,
//   port: process.env.NODEMAILER_PORT,
//   secure: false,
//   auth: {
//     user: process.env.NODEMAILER_USER,
//     pass: process.env.NODEMAILER_PASS,
//   },
// });

// module.exports = async function sendEmail(to, code) {
//   await transporter.sendMail({
//     from: `"No Reply" <${process.env.NODEMAILER_USER}>`,
//     to,
//     subject: "Verification Code",
//     text: `Your verification code is: ${code}`,
//   });
// };

const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.AWS_REGION, // match your SES region
});

const ses = new AWS.SES();

exports.sendOTP = async (email, otp) => {
  
  console.log("Sender Email:", process.env.SENDER_EMAIL);
  const params = {
    Source: process.env.SENDER_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "Your OTP Code",
      },
      Body: {
        Text: {
          Data: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

// Example usage
// sendOTP("rohitsingh78794@gmail.com", "123456");
