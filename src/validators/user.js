const { body } = require("express-validator");

exports.validateUserRegisterInput = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .isLength({ min: 8, max: 30 })
    .withMessage("Email must be between 8 and 30 characters")
    .bail()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .bail()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/)
    .withMessage(
      "Password must contain at least one number and one special character"
    ),
];
