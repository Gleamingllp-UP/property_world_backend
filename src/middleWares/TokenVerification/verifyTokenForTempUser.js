const jwt = require("jsonwebtoken");

exports.verifyTokenForTempUser = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_INITIATE_SIGNUP);

    if (decoded.role !== process.env.TEMP_ROLE) {
      return res.status(403).json({
        message: "Access denied. Temporary Users only.",
        success: false,
        status: 403,
      });
    }

    req.tempUSer = decoded;
    next();
    
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
  }
};
