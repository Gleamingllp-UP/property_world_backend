const express = require("express");
const {
  socialMediaEndpoints,
} = require("../../utils/endpoints/socialMediaEndpoints");

const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { validate } = require("../../middleWares/validate");
const {
  socialMediaAllowedFields,
} = require("../../utils/validateFields/socialMediaFields");
const {
  validatorSocialMediaCreate,
  validatorSocialMediaUpdate,
  validatorSocialMediaDelete,
  validatorSocialMediaUpdateStatus,
} = require("../../validators/socialMedia");
const {
  addSocialMedia,
  getAllSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  updateSocialMediaStatus,
  getAllSocialMediaForUser,
} = require("../../controller/socialMedia/socialMediaController");

const socialMediaRouter = express.Router();

socialMediaRouter.post(
  socialMediaEndpoints.createSocialMedia,
  verifyTokenAdmin,
  validateOnlyAllowedFields(socialMediaAllowedFields),
  validatorSocialMediaCreate,
  validate,
  addSocialMedia
);

socialMediaRouter.get(
  socialMediaEndpoints.getAllSocialMedia,
  verifyTokenAdmin,
  getAllSocialMedia
);
socialMediaRouter.get(
  socialMediaEndpoints.getAllSocialMediaForUser,
  verifyTokenUser,
  getAllSocialMediaForUser
);

socialMediaRouter.put(
  socialMediaEndpoints.updateSocialMedia,
  verifyTokenAdmin,
  validateOnlyAllowedFields(socialMediaAllowedFields),
  validatorSocialMediaUpdate,
  validate,
  updateSocialMedia
);

socialMediaRouter.delete(
  socialMediaEndpoints.deleteSocialMedia,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorSocialMediaDelete,
  validate,
  deleteSocialMedia
);

socialMediaRouter.put(
  socialMediaEndpoints.updateSocialMediaStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorSocialMediaUpdateStatus,
  validate,
  updateSocialMediaStatus
);

module.exports = socialMediaRouter;
