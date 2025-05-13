const { body, param } = require("express-validator");


const allowedTypes = ["privacy_policy", "terms_and_conditions", "cookies_policy"];


const validateMongoIdParam = (field = "id") => [
  param(field)
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];


const basePolicyFields = [
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .bail()
    .isIn(allowedTypes)
    .withMessage(`Type must be one of: ${allowedTypes.join(", ")}`),

  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("short_description")
    .notEmpty()
    .withMessage("Short description is required"),

  body("long_description")
    .notEmpty()
    .withMessage("Long description is required"),
];


exports.validatorPolicyCreate = [...basePolicyFields];


exports.validatorPolicyUpdate = [
  ...validateMongoIdParam(),
  ...basePolicyFields,
];


exports.validatorPolicyGetById = validateMongoIdParam();


exports.validatorPolicyDelete = validateMongoIdParam();
