const { body, param } = require("express-validator");

exports.validatorBlogPostAddInput = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .bail(),

  body("content").not().isEmpty().withMessage("Content is required"),

  body("category")
    .not()
    .isEmpty()
    .withMessage("Category is required")
    .bail(),

  body("author")
    .not()
    .isEmpty()
    .withMessage("Author is required")
    .bail(),

  body("coverImg").not().isEmpty().withMessage("Image is required"),
];

exports.validatorBlogPostUpdateInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

  body("title")
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .bail(),

 
    body("content").not().isEmpty().withMessage("Content is required"),

    body("category")
      .not()
      .isEmpty()
      .withMessage("Category is required")
      .bail(),
  
    body("author")
      .not()
      .isEmpty()
      .withMessage("Author is required")
      .bail(),
  
    body("coverImg").not().isEmpty().withMessage("Image is required"),
];

exports.validatorBlogPostDeleteInput=[
    param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
]

exports.validatorBlogPostGetByIdInput=[
    param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
]
exports.validatorBlogPostUpdateStatusIdInput=[
    param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
]