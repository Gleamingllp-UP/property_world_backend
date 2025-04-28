const { body, param } = require("express-validator");

exports.validateUserTypeInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Invalid format"),
];

exports.validateUserTypeUpdateInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Invalid format"),

  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateUserTypeDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateUserTypeStatusInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

];