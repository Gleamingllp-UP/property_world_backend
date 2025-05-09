const { body, param } = require("express-validator");

exports.validatorAddAboutUsInput = [
  body("profileHeading")
    .notEmpty()
    .withMessage("Profile Heading is required")
    .bail(),

  body("profileDesc").not().isEmpty().withMessage("Profile Desc is required"),

  body("visionHeading")
    .notEmpty()
    .withMessage("Vision Heading is required")
    .bail(),

  body("visionDesc").notEmpty().withMessage("Vision Desc is required").bail(),
  body("missionHeading")
    .notEmpty()
    .withMessage("Mision Heading is required")
    .bail(),

  body("missionDesc").notEmpty().withMessage("Mision Desc is required").bail(),
];

exports.validatorAboutUsUpdateInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),

  body("profileHeading")
    .notEmpty()
    .withMessage("Profile Heading is required")
    .bail(),

  body("profileDesc").not().isEmpty().withMessage("Profile Desc is required"),

  body("visionHeading")
    .notEmpty()
    .withMessage("Vision Heading is required")
    .bail(),

  body("visionDesc").notEmpty().withMessage("Vision Desc is required").bail(),
  body("missionHeading")
    .notEmpty()
    .withMessage("Mision Heading is required")
    .bail(),

  body("missionDesc").notEmpty().withMessage("Mision Desc is required").bail(),
];

exports.validatorAboutUsDeleteInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];

exports.validatorAboutUsGetByIdInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
exports.validatorAboutUsUpdateStatusIdInput = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid ID format"),
];
