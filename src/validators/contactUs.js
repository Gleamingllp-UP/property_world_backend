const { body, param } = require("express-validator");


exports.validatorAddContactUsInput = [
  body("tele_phone")
    .notEmpty()
    .withMessage("Telephone number is required")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid telephone number"),

  body("whatsapp_number")
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid WhatsApp number"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];


exports.validatorContactUsUpdateInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

    body("tele_phone")
    .notEmpty()
    .withMessage("Telephone number is required")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid telephone number"),

  body("whatsapp_number")
    .notEmpty()
    .withMessage("WhatsApp number is required")
    .bail()
    .isMobilePhone()
    .withMessage("Invalid WhatsApp number"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters long"),
];

exports.validatorContactUsDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

