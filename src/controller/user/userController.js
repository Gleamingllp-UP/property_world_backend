const User = require("../../model/user/userModel");
const generateCode = require("../../utils/functions/generateCode");
const bcrypt = require("bcryptjs");
const TempUser = require("../../model/user/tempUserModel");
const sendEmailForCode = require("../../utils/sendEmails/sendEmailForCode");
const {
  generateTokenForInitiateSignUp,
} = require("../../utils/generateToken/generateTokenForInitateSignUp");
const {
  generateTokenForUserLogin,
} = require("../../utils/generateToken/generateTokenForUserLogin");

exports.initiateSignup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      country_code,
      phone_number,
      dob,
      country_of_residance,
      email,
      user_type,
      is_accepted_privacy_and_policy,
      is_accepted_terms_and_condition,
    } = req.body;

    const existing = await TempUser.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (existing) {
      return res.status(400).json({
        message: "User with this email or phone number already exists.",
        success: false,
        status: 400,
      });
    }

    // Generate code and expiration
    const code = generateCode();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // await sendEmailForCode(email, code);

    const resultTempUser = await TempUser.create({
      first_name,
      last_name,
      country_code,
      phone_number,
      dob,
      country_of_residance,
      email,
      user_type,
      is_accepted_privacy_and_policy,
      is_accepted_terms_and_condition,
      codeExpires,
      code,
    });

    if (!resultTempUser || !resultTempUser?._id) {
      return res.status(500).json({
        message: "Failed to save temporary user",
        success: false,
        status: 500,
      });
    }

    const payload = {
      id: resultTempUser?._id,
      email: resultTempUser?.email,
      role: process.env.TEMP_ROLE,
    };

    const temptoken = generateTokenForInitiateSignUp(payload);

    return res.status(200).json({
      message: "Verification code sent to email.",
      temporaryToken: temptoken,
      code: code,
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

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (email !== req?.tempUSer?.email) {
      return res.status(400).json({
        message: "Token is not valid or Email mismatch.",
        success: false,
        status: 400,
      });
    }

    if (!tempUser) {
      return res.status(404).json({
        message: "User with this email is not exists.",
        success: false,
        status: 404,
      });
    }

    if (Number(tempUser.code) !== Number(code)) {
      return res.status(400).json({
        message: "Invalid code.",
        success: false,
        status: 400,
      });
    }

    if (tempUser.codeExpires < new Date()) {
      return res.status(400).json({
        message: "Code has been expired",
        success: false,
        status: 400,
      });
    }

    tempUser.is_email_verified = true;
    await tempUser.save();

    return res.status(200).json({
      message: "Code verified",
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

exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isTempUserExist = await TempUser.findOne({ email });

    if (email !== req?.tempUSer?.email) {
      return res.status(400).json({
        message: "Token is not valid or Email mismatch.",
        success: false,
        status: 400,
      });
    }

    if (!isTempUserExist) {
      return res.status(404).json({
        message: "User with this email is not exists.",
        success: false,
        status: 404,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const resultUser = await User.create({
      first_name: isTempUserExist?.first_name,
      last_name: isTempUserExist?.last_name,
      country_code: isTempUserExist?.country_code,
      phone_number: isTempUserExist?.phone_number,
      dob: isTempUserExist?.dob,
      country_of_residance: isTempUserExist?.country_of_residance,
      email: isTempUserExist?.email,
      password: hashedPassword,
      user_type: isTempUserExist?.user_type,
      is_accepted_privacy_and_policy:
        isTempUserExist?.is_accepted_privacy_and_policy,
      is_accepted_terms_and_condition:
        isTempUserExist?.is_accepted_terms_and_condition,
      is_email_verified: true,
      is_phone_verified: false,
      is_blocked: false,
    });

    if (resultUser) {
      await TempUser.findByIdAndDelete(isTempUserExist?._id);

      const resposeData = {
        _id: resultUser?._id,
        first_name: resultUser?.first_name,
        last_name: resultUser?.last_name,
        phone_number: resultUser?.phone_number,
        dob: resultUser?.dob,
        email: resultUser?.email,
        is_accepted_privacy_and_policy:
          resultUser?.is_accepted_privacy_and_policy,
        is_accepted_terms_and_condition:
          resultUser?.is_accepted_terms_and_condition,
        is_user_verified: resultUser?.is_user_verified,
        is_email_verified: resultUser?.is_email_verified,
        is_phone_verified: resultUser?.is_phone_verified,
        is_blocked: resultUser?.is_blocked,
      };
      return res.status(200).json({
        message: "Password created successfully.",
        data: resposeData,
        status: 200,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Failed to set password",
        status: 400,
        success: false,
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

exports.addUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
        status: 400,
      });
    }

    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt);

    const userData = await new User({
      email: email,
      role: role,
      password: hashedPassword,
    });

    const result = await userData.save();

    if (!result) {
      return res.status(400).json({
        message: "Failed to add user",
        status: 400,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successfully added user",
      success: true,
      status: 200,
      data: result,
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

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
        status: 401,
      });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
        status: 403,
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        message: "Your account is blocked. Contact support.",
        success: false,
        status: 403,
      });
    }

    const payload = {
      id: user?._id,
      email: user?.email,
      role: user?.user_type,
    };

    const token = generateTokenForUserLogin(payload);

    const userData = {
      _id: user?._id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone_number: user?.phone_number,
      is_email_verified: user?.is_email_verified,
      is_phone_verified: user?.is_phone_verified,
      is_blocked: user?.is_blocked,
    };

    return res.status(200).json({
      message: "Login successful",
      success: true,
      status: 200,
      data: userData,
      token: token,
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
