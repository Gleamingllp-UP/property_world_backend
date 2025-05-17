const User = require("../../model/user/userModel");
const UserType = require("../../model/user-types/userTypeModel");
const generateCode = require("../../utils/functions/generateCode");
const bcrypt = require("bcryptjs");
const TempUser = require("../../model/user/tempUserModel");
const TempAgentUser = require("../../model/user/tempAgentModel");
const mongoose = require("mongoose");
const sendEmailForCode = require("../../utils/sendEmails/sendEmailForCode");
const {
  generateTokenForInitiateSignUp,
} = require("../../utils/generateToken/generateTokenForInitateSignUp");
const {
  generateTokenForUserLogin,
} = require("../../utils/generateToken/generateTokenForUserLogin");
const {
  generateRandomPassword,
} = require("../../utils/functions/generateRandomPassword");

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

      // Agent-specific fields
      trade_license,
      company_name,
      office_address,
      broker_license_number,
      office_registration_number,
      agency_logo,
      agent_photo,
    } = req.body;

    const existingTempUser = await TempUser.findOne({
      $or: [{ email }, { phone_number }],
    });
    const isUserExist = await User.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (isUserExist) {
      return res.status(400).json({
        message: "User with this email or phone number already exists.",
        success: false,
        status: 400,
      });
    }
    if (existingTempUser) {
      await existingTempUser.deleteOne();
    }

    // Generate code and expiration
    const code = generateCode();
    const codeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // await sendEmailForCode(email, code);

    const isUserTypeExist = await UserType.findById({ _id: user_type });
    if (!isUserTypeExist) {
      return res.status(400).json({
        message: "User type does not exist.",
        success: false,
        status: 400,
      });
    }

    if (isUserTypeExist?.name === "Agent") {
      const resultTempAgentUser = await TempAgentUser.create({
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

        // Agent-specific fields
        trade_license,
        company_name,
        office_address,
        broker_license_number,
        office_registration_number,
        agency_logo,
        agent_photo,
      });

      if (!resultTempAgentUser || !resultTempAgentUser?._id) {
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
    } else {
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

    const isUserTypeExist = await UserType.findById({
      _id: isTempUserExist?.user_type,
    });

    if (!isUserTypeExist) {
      return res.status(400).json({
        message: "User type does not exist.",
        success: false,
        status: 400,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const commonFields = {
      first_name: isTempUserExist?.first_name,
      last_name: isTempUserExist?.last_name,
      country_code: isTempUserExist?.country_code,
      phone_number: isTempUserExist?.phone_number,
      dob: isTempUserExist?.dob,
      country_of_residance: isTempUserExist?.country_of_residance,
      email: isTempUserExist?.email,
      password: hashedPassword,
      user_type: new mongoose.Types.ObjectId(
        String(isTempUserExist?.user_type)
      ),
      is_accepted_privacy_and_policy:
        isTempUserExist?.is_accepted_privacy_and_policy,
      is_accepted_terms_and_condition:
        isTempUserExist?.is_accepted_terms_and_condition,
      is_email_verified: true,
      is_phone_verified: false,
      is_blocked: false,
    };

    // const resultUser = await User.create({
    //   first_name: isTempUserExist?.first_name,
    //   last_name: isTempUserExist?.last_name,
    //   country_code: isTempUserExist?.country_code,
    //   phone_number: isTempUserExist?.phone_number,
    //   dob: isTempUserExist?.dob,
    //   country_of_residance: isTempUserExist?.country_of_residance,
    //   email: isTempUserExist?.email,
    //   password: hashedPassword,
    //   user_type: new mongoose.Types.ObjectId(
    //     String(isTempUserExist?.user_type)
    //   ),
    //   is_accepted_privacy_and_policy:
    //     isTempUserExist?.is_accepted_privacy_and_policy,
    //   is_accepted_terms_and_condition:
    //     isTempUserExist?.is_accepted_terms_and_condition,
    //   is_email_verified: true,
    //   is_phone_verified: false,
    //   is_blocked: false,
    // });

    let resultUser;
    if (isUserTypeExist?.name === "Agent") {
      // Add agent-specific fields
      resultUser = await User.create({
        ...commonFields,
        trade_license: isTempUserExist?.trade_license,
        company_name: isTempUserExist?.company_name,
        office_address: isTempUserExist?.office_address,
        broker_license_number: isTempUserExist?.broker_license_number,
        office_registration_number: isTempUserExist?.office_registration_number,
        agency_logo: isTempUserExist?.agency_logo,
        agent_photo: isTempUserExist?.agent_photo,
      });
    } else {
      resultUser = await User.create(commonFields);
    }
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

exports.initiateSignupByAdmin = async (req, res) => {
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

    const existing = await User.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (existing) {
      return res.status(400).json({
        message: "User with this email or phone number already exists.",
        success: false,
        status: 400,
      });
    }

    // Generate random password and hash it
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const resultUser = await User.create({
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
      password: hashedPassword,
      is_email_verified: true,
      is_user_verified_by_admin: true,
    });

    if (!resultUser || !resultUser?._id) {
      return res.status(500).json({
        message: "Failed to save user",
        success: false,
        status: 500,
      });
    }

    // Send password via email
    // await sendEmailWithPassword(email, plainPassword, first_name);

    return res.status(200).json({
      message: "User created and password sent via email.",
      success: true,
      password: plainPassword, //remove after testing
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

    if (!user?.is_email_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        success: false,
        status: 403,
      });
    }
    if (user?.is_deleted) {
      return res.status(403).json({
        message: "Your account is deleted. Contact support.",
        success: false,
        status: 403,
      });
    }
    if (!user?.status) {
      return res.status(403).json({
        message:
          "Your account is inactive or has been disabled. Please contact support.",
        success: false,
        status: 403,
      });
    }

    if (!user?.is_user_verified_by_admin) {
      return res.status(403).json({
        message: "Your account is pending admin approval.",
        success: false,
        status: 403,
      });
    }

    if (user?.is_blocked) {
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

exports.getAllUsers = async (req, res) => {
  try {
    let { user_type, page = 1, limit = 10, type } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (user_type && mongoose.Types.ObjectId.isValid(user_type)) {
      filter.user_type = new mongoose.Types.ObjectId(String(user_type));
    }
    if (type === "deleted") {
      filter.is_deleted = true;
    }

    if (type === "blocked") {
      filter.is_blocked = true;
      filter.is_deleted = false;
    }

    if (type === "unverified") {
      filter.is_user_verified_by_admin = false;
      filter.is_deleted = false;
    }

    if (type === "active") {
      filter.status = true;
      filter.is_deleted = false;
    }

    if (type === "inactive") {
      filter.status = false;
      filter.is_deleted = false;
    }

    // If no type is specified, default to non-deleted users
    if (!type) {
      filter.is_deleted = false;
    }
    const skip = (page - 1) * limit;

    const result = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "usertypes", // collection name, not model
          localField: "user_type",
          foreignField: "_id",
          as: "userType",
        },
      },
      { $unwind: "$userType" },
      {
        $addFields: {
          userType: {
            name: "$userType.name",
            status: "$userType.status",
          },
        },
      },
      { $unset: ["password", "user_type", "tokenVersion"] },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // const result = await User.find(filter)
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1});

    const total = await User.countDocuments(filter);

    if (result) {
      return res.status(200).json({
        message: "User fetched successfully",
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Error in database",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateUserStatusWithKey = async (req, res) => {
  try {
    const { id } = req.params;
    const { key } = req.body;

    const isUserExist = await User.findById(id);
    if (!isUserExist) {
      return res.status(400).json({
        message: "User does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isUserExist[key];

    const updateData = {
      [key]: updatedStatus,
    };

    if (key === "is_deleted") {
      updateData.deletedAt = updatedStatus ? new Date() : null;
    }

    const result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password -tokenVersion");

    if (result) {
      return res.status(200).json({
        message: `User ${key} updated successfully!`,
        id,
        key,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating User",
        status: 500,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getUserAllDetails = async (req, res) => {
  try {
    const email = req?.user?.email;
    const isUserExist = await User.findOne({ email }).select(
      "-password -tokenVersion"
    );

    if (!isUserExist) {
      return res.status(404).json({
        message: "User with this email is not exists.",
        success: false,
        status: 404,
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully!",
      data: isUserExist,
      status: 200,
      success: true,
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
