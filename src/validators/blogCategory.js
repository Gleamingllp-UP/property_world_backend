const { body, param } = require("express-validator");

exports.validatorBlogCategoryInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),
];

exports.validatorBlogCategoryUpdateInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),

  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validatorBlogCategoryDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validatorBlogCategoryStatusInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

];