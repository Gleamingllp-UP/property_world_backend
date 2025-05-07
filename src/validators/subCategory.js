const { body, param } = require("express-validator");

exports.validateSubCategoryInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),
    
  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid categoryId format"),
];

exports.validateSubCategoryUpdateInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid categoryId format"),

  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateSubCategoryDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateSubCategoryStatusInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
