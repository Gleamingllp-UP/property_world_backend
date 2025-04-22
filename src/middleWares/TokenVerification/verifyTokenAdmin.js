const jwt = require("jsonwebtoken");

exports.verifyTokenAdmin = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
        success: false,
        status: 403,
      });
    }

    req.user = decoded;
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
