const express = require("express");
const { bannerEndpoints } = require("../../utils/endpoints/bannerEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  bannerAllowedFields,
} = require("../../utils/validateFields/bannerFields");
const {
  validatorBannerCreate,
  validatorBannerUpdate,
  validatorBannerDelete,
  validatorBannerUpdateStatus,
  validatorBannerByTypeForUser,
} = require("../../validators/banner");
const { validate } = require("../../middleWares/validate");
const {
  addBanner,
  getAllBanner,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
  getAllBannerForUser,
  getBannerByTypeForUser,
  getBannerById,
} = require("../../controller/banner/bannerController");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
const {
  dynamicSingleImageUpload,
} = require("../../middleWares/fileUpload/uploadFile");
const { validateUpload } = require("../../middleWares/validateUpload");

const bannerRouter = express.Router();

bannerRouter.post(
  bannerEndpoints.createBanner,
  verifyTokenAdmin,
  dynamicSingleImageUpload("banner_img"),
  validateUpload({
    fieldName: "banner_img",
    type: "both",
  }),
  validateOnlyAllowedFields(bannerAllowedFields),
  validatorBannerCreate,
  validate,
  addBanner
);

bannerRouter.get(bannerEndpoints.getAllBanner, verifyTokenAdmin, getAllBanner);
bannerRouter.get(bannerEndpoints.getBannerById, verifyTokenAdmin, getBannerById);

bannerRouter.put(
  bannerEndpoints.updateBanner,
  verifyTokenAdmin,
  dynamicSingleImageUpload("banner_img"),
  validateUpload({
    fieldName: "banner_img",
    type: "both",
    required: false,
  }),
  validateOnlyAllowedFields(bannerAllowedFields),
  validatorBannerUpdate,
  validate,
  updateBanner
);

bannerRouter.put(
  bannerEndpoints.updateBannerStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBannerUpdateStatus,
  validate,
  updateBannerStatus
);

bannerRouter.delete(
  bannerEndpoints.deleteBanner,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBannerDelete,
  validate,
  deleteBanner
);

bannerRouter.get(
  bannerEndpoints.getBannerByTypeForUser,
  verifyTokenUser,
  validatorBannerByTypeForUser,
  validate,
  getBannerByTypeForUser
);

module.exports = bannerRouter;
