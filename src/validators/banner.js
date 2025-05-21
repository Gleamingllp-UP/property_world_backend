const { body, query } = require("express-validator");
const {
  validateMongoIdParam,
} = require("../utils/functions/validateMongoIdParam");
const { bannerAllowedTypes } = require("../utils/validateFields/bannerFields");

const baseBannerFields = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .bail()
    .isIn(bannerAllowedTypes)
    .withMessage(`Type must be one of: ${bannerAllowedTypes.join(", ")}`),

  body("banner_img")
    .optional()
    .isURL()
    .withMessage("imageUrl must be a valid URL"),
];

exports.validatorBannerCreate = [...baseBannerFields];

exports.validatorBannerUpdate = [
  ...validateMongoIdParam(),
  ...baseBannerFields,
];

exports.validatorBannerUpdateStatus = validateMongoIdParam();

exports.validatorBannerDelete = validateMongoIdParam();

exports.validatorBannerByTypeForUser = [
  query("type")
    .notEmpty()
    .withMessage("Type is required")
    .bail()
    .isIn(bannerAllowedTypes)
    .withMessage(`Type must be one of: ${bannerAllowedTypes.join(", ")}`),
];
