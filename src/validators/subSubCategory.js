const { body, param } = require("express-validator");

exports.validateSubSubCategoryInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),
    
  body("subCategoryId")
    .notEmpty()
    .withMessage("subCategoryId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid subCategoryId format"),
];

exports.validateSubSubCategoryUpdateInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/)
    .withMessage("Invalid format"),

  body("subCategoryId")
    .notEmpty()
    .withMessage("subCategoryId is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid subCategoryId format"),

  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateSubSubCategoryDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validateSubSubCategoryStatusInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
