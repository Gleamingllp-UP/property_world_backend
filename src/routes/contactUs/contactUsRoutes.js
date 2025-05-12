const express = require("express");
const {
  contactUsEndpoints,
} = require("../../utils/endpoints/contactUsEndpoints");

const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { validate } = require("../../middleWares/validate");
const {
  contactUsAllowedFields,
  contactUsAllowedFieldsForUpdate,
} = require("../../utils/validateFields/contactUsFields");
const {
  addContactUs,
  getAllContactUs,
  updateContactUs,
  deleteContactUs,
} = require("../../controller/contactUs/contactUsController");
const {
  dynamicSingleImageUpload,
} = require("../../middleWares/fileUpload/uploadFile");
const {
  validatorAddContactUsInput,
  validatorContactUsUpdateInput,
  validatorContactUsDeleteInput,
} = require("../../validators/contactUs");

const contactUsRouter = express.Router();

contactUsRouter.post(
  contactUsEndpoints.createContactUs,
  verifyTokenAdmin,
  dynamicSingleImageUpload("cover_img"),
  validateOnlyAllowedFields(contactUsAllowedFields),
  validatorAddContactUsInput,
  validate,
  addContactUs
);

contactUsRouter.get(
  contactUsEndpoints.getAllContactUs,
  verifyTokenAdmin,
  getAllContactUs
);

contactUsRouter.put(
  contactUsEndpoints.updateContactUs,
  verifyTokenAdmin,
  dynamicSingleImageUpload("cover_img"),
  validateOnlyAllowedFields(contactUsAllowedFieldsForUpdate),
  validatorContactUsUpdateInput,
  validate,
  updateContactUs
);

contactUsRouter.delete(
  contactUsEndpoints.deleteContactUs,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorContactUsDeleteInput,
  validate,
  deleteContactUs
);

module.exports = contactUsRouter;
