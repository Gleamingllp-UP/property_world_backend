const User = require("../../model/user/userModel");
const jwt = require("jsonwebtoken");

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

    const payload = {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY_FOR_USER, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      status: 200,
      data: user,
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
