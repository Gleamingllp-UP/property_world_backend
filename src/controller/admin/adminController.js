const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../../model/admin/adminModel");

exports.adminRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isAdminExist = await Admin.findOne({ email });

    if (isAdminExist) {
      return res.status(400).json({
        message: "Admin already exist",
        success: false,
        status: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      email,
      password: hashedPassword,
    });
    const result = await admin.save();
    if (result) {
      return res.status(201).json({
        message: "Admin created successfully",
        success: true,
        status: 201,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create admin",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      success: false,
      status: 500,
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isAdminExist = await Admin.findOne({ email });

    if (!isAdminExist) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
        status: 404,
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isAdminExist.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
        status: 401,
      });
    } else {
      const token = jwt.sign(
        {
          id: isAdminExist._id,
          email: isAdminExist.email,
          role: isAdminExist.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRATION_TIME }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure this is true in production with HTTPS
        sameSite: "Strict", // Helps prevent CSRF attacks
        maxAge: 3600000,
      });
      return res.status(200).json({
        message: "Admin logged in successfully",
        success: true,
        status: 200,
        token: token,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      success: false,
      status: 500,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const tokenEmail = req.user?.email;
    const bodyEmail = email;

    if (bodyEmail && bodyEmail !== tokenEmail) {
      return res.status(403).json({
        message: "Email mismatch: unauthorized access",
        success: false,
        status: 403,
      });
    }

    const isAdminExist = await Admin.findOne({ email });

    if (!isAdminExist) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
        status: 404,
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      isAdminExist.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the old password",
        success: false,
        status: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    isAdminExist.password = hashedPassword;
    await isAdminExist.save();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      success: false,
      status: 500,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const tokenEmail = req?.user?.email;

    if (email !== tokenEmail) {
      return res.status(403).json({
        message: "Email mismatch! unauthorized access.",
        status: 403,
        success: false,
      });
    }

    const isAdminExist = Admin.findOne({ email });
    if (!isAdminExist) {
      return res.status(404).json({
        message: "Admin not found",
        status: 404,
        success: false,
      });
    }

    const token = jwt.sign(
      { id: isAdminExist?._id, tokenVersion: isAdminExist?.tokenVersion },
      process.env.JWT_SECRET_KEY_FORGET_PASSWORD,
      process.env.JWT_EXPIRATION_TIME_FORGET_PASSWORD
    );

    const resetURL = `${process.env.FRONTEND_URL}?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"PropertyWorld.com" <${process.env.NODEMAILER_USER}>`,
      to: isAdminExist?.email,
      subject: "Password Reset Request",
      html: `
     <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; color: #333; padding: 24px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:logoImage" alt="Holiday2.com Logo" style="max-width: 180px;" />
      </div>

      <h2 style="color: #0a85ea;">Password Reset Request</h2>

      <p style="font-size: 16px; line-height: 1.6;">
        Dear Admin,<br><br>
        We received a request to reset your password. You can reset it by clicking the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" target="_blank" style="background-color: #0a85ea; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          Reset Your Password
        </a>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">
        This link will expire in 1 hour for your security.
      </p>

      <p style="font-size: 15px; line-height: 1.6;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>

      <p style="margin-top: 40px;">Best regards,<br /><strong>The Holiday2.com Team</strong></p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

      <footer style="font-size: 12px; color: #777; text-align: center;">
        © ${new Date().getFullYear()} Holiday2.com. All rights reserved.
      </footer>
    </div>
  `,
      // attachments: [
      //   {
      //     filename: "logo.png",
      //     path: path.join(__dirname, "../../../../uploads/logo.png"),
      //     cid: "logoImage",
      //   },
      // ],
    });

    return res.status(200).json({
      message: "Password reset link sent",
      success: true,
      token: resetToken,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY_FORGET_PASSWORD
    );
    // console.log('decoded---',decoded);
    const adminDetails = decoded?._doc;
    const userId = adminDetails?._id;

    const admin = await Admin.findById({ _id: userId });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Admin not found", success: false, status: 404 });
    }

    if (admin?.tokenVersion !== adminDetails?.tokenVersion) {
      return res.status(401).json({
        message: "Token has been invalidated due to a password reset",
        success: false,
        status: 401,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    admin.tokenVersion += 1;
    await admin.save();

    return res.status(200).json({
      message: "Password successfully updated",
      success: true,
      status: 200,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token has expired. Please request a new one.",
        success: false,
        status: 401,
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid token. Please request a new one.",
        success: false,
        status: 401,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
};
