const { body } = require("express-validator");
const {
  validateMongoIdParam,
} = require("../utils/functions/validateMongoIdParam");

const baseSocialMediaFields = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),

  body("className").notEmpty().withMessage("ClassName is required"),

  body("link").notEmpty().withMessage("Link is required"),
];

exports.validatorSocialMediaCreate = [...baseSocialMediaFields];

exports.validatorSocialMediaUpdate = [
  ...validateMongoIdParam(),
  ...baseSocialMediaFields,
];

exports.validatorSocialMediaUpdateStatus = validateMongoIdParam();

exports.validatorSocialMediaDelete = validateMongoIdParam();
