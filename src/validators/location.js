const { body, param } = require("express-validator");

exports.validatorLocationInput = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim(),

  body("pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .bail()
    .isPostalCode("any")
    .withMessage("Pincode must be a valid UAE postal code")
    .bail()
    .matches(/^\d{5}$/)
    .withMessage("Pincode must be a 5-digit number")
    .bail()
    .trim(),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .bail()
    .toFloat() // no .withMessage() here
    .isFloat({ min: 22, max: 25 })
    .withMessage("Latitude must be a valid number between 22 and 25")
    .bail(),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .bail()
    .toFloat() // no .withMessage() here
    .isFloat({ min: 51, max: 55 })
    .withMessage("Longitude must be a valid number between 51 and 55)")
    .bail(),
];

exports.validatorLocationUpdateInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim(),

  body("pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .bail()
    .isPostalCode("any")
    .withMessage("Pincode must be a valid UAE postal code")
    .bail()
    .trim(),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .bail()
    .isFloat({ min: 22, max: 25 })
    .withMessage("Latitude must be within Abu Dhabi range (22–25)")
    .bail(),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .bail()
    .isFloat({ min: 51, max: 55 })
    .withMessage("Longitude must be within Abu Dhabi range (51–55)")
    .bail(),
];

exports.validatorLocationDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validatorLocationUpdateStatus = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
