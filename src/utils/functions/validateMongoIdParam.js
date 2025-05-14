const { body, param } = require("express-validator");

exports.validateMongoIdParam = (field = "id") => [
  param(field)
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
