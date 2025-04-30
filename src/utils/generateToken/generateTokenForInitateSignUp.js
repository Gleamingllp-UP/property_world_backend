const jwt = require("jsonwebtoken");

exports.generateTokenForInitiateSignUp = (payload) => {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    throw new Error("Payload must be a non-null object");
  } else {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY_FOR_INITIATE_SIGNUP, {
      expiresIn: process.env.JWT_EXPIRATION_TIME_FOR_INITIATE_SIGNUP,
    });
  }
};
