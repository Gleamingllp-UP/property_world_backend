const { body, param } = require("express-validator");

exports.validatorUserVerifyCodeInput = [
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

  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be 6 characters long")
    .bail(),
];

exports.validatorUserSetPasswordInput = [
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

exports.validatorUserLoginInput = [
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

exports.validatorInitiateSignUp = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .bail(),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .bail(),

  body("country_code")
    .notEmpty()
    .withMessage("Country code is required")
    .bail()
    .isInt()
    .withMessage("Country code must be a number")
    .bail(),

  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .bail()
    .isInt()
    .withMessage("Phone number must be numeric")
    .bail(),

  body("dob").notEmpty().withMessage("Date of birth is required").bail(),

  body("country_of_residance")
    .trim()
    .notEmpty()
    .withMessage("Country of residence is required")
    .bail(),

  body("email")
    .trim()
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
    .withMessage("Invalid email format")
    .bail(),

  body("user_type")
    .notEmpty()
    .withMessage("User type is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid user_type ObjectId")
    .bail(),

  body("is_accepted_privacy_and_policy")
    .notEmpty()
    .withMessage("Privacy policy acceptance is required")
    .bail()
    .isBoolean()
    .withMessage("Privacy policy acceptance must be boolean")
    .bail(),

  body("is_accepted_terms_and_condition")
    .notEmpty()
    .withMessage("Terms acceptance is required")
    .bail()
    .isBoolean()
    .withMessage("Terms acceptance must be boolean")
    .bail(),
];

exports.validatorUserStatusWithKeyInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

  body("key")
    .notEmpty()
    .withMessage("Key is required")
    .bail()
    .isString()
    .withMessage("Key must be string"),
];
