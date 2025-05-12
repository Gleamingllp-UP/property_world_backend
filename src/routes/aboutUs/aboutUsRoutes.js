const express = require("express");
const { aboutUsEndpoints } = require("../../utils/endpoints/aboutEndPoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  aboutUsAllowedFields,
  aboutUsAllowedFieldsForUpdate,
} = require("../../utils/validateFields/aboutUsFields");
const {
  validatorAddAboutUsInput,
  validatorAboutUsUpdateInput,
  validatorAboutUsDeleteInput,
  validatorAboutUsUpdateStatusIdInput,
} = require("../../validators/aboutUs");
const { validate } = require("../../middleWares/validate");
const {
  addAboutUs,
  updateAboutUs,
  deleteAboutUs,
  updateAboutUsStatus,
  getAllAboutUs,
} = require("../../controller/aboutUs/aboutUsController");
const { createUploader } = require("../../middleWares/fileUpload/uploadFile");

const aboutUsRouter = express.Router();

aboutUsRouter.post(
  aboutUsEndpoints.createAboutUs,
  verifyTokenAdmin,
  createUploader([
    { name: "profile", maxCount: 1 },
    { name: "vision", maxCount: 1 },
    { name: "visionBg", maxCount: 1 },
    { name: "mission", maxCount: 1 },
  ]),
  validateOnlyAllowedFields(aboutUsAllowedFields),
  validatorAddAboutUsInput,
  validate,
  addAboutUs
);

aboutUsRouter.get(aboutUsEndpoints.getAllAboutUs, verifyTokenAdmin, getAllAboutUs);

aboutUsRouter.put(
  aboutUsEndpoints.updateAboutUs,
  verifyTokenAdmin,
  createUploader([
    { name: "profile", maxCount: 1 },
    { name: "vision", maxCount: 1 },
    { name: "visionBg", maxCount: 1 },
    { name: "mission", maxCount: 1 },
  ]),
  validateOnlyAllowedFields(aboutUsAllowedFieldsForUpdate),
  validatorAboutUsUpdateInput,
  validate,
  updateAboutUs
);

aboutUsRouter.delete(
  aboutUsEndpoints.deleteAboutUs,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorAboutUsDeleteInput,
  validate,
  deleteAboutUs
);

aboutUsRouter.put(
  aboutUsEndpoints.updateAboutUsStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorAboutUsUpdateStatusIdInput,
  validate,
  updateAboutUsStatus
);

module.exports = aboutUsRouter;
