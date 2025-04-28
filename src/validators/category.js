const { body, param } = require("express-validator");

exports.validateCategoryInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Invalid format"),
];

exports.validateCategoryUpdateInput = [
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

exports.validateCategoryDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateCategoryStatusInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

];