const express = require("express");
const {
  subSubCategoryEndpoints,
} = require("../../utils/endpoints/subSubCategoryEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validateSubSubCategoryInput,
  validateSubSubCategoryUpdateInput,
  validateSubSubCategoryDeleteInput,
  validateSubSubCategoryStatusInput
} = require("../../validators/subSubCategory");
const { validate } = require("../../middleWares/validate");
const {
  addSubSubCategory,
  getAllSubSubCategory,
  deleteSubSubCategory,
  updateSubSubCategory,
  updateSubSubCategoryStatus,
  getAllActiveSubSubCategory
} = require("../../controller/subSubCategory/subSubCategoryController");

const subSubCategoryRouter = express.Router();

subSubCategoryRouter.post(
  subSubCategoryEndpoints.createsubSubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "subCategoryId"]),
  validateSubSubCategoryInput,
  validate,
  addSubSubCategory
);

subSubCategoryRouter.get(
  subSubCategoryEndpoints.getAllsubSubCategory,
  verifyTokenAdmin,
  getAllSubSubCategory
);



subSubCategoryRouter.put(
  subSubCategoryEndpoints.updatesubSubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "subCategoryId"]),
  validateSubSubCategoryUpdateInput,
  validate,
  updateSubSubCategory,
);

subSubCategoryRouter.delete(
  subSubCategoryEndpoints.deletesubSubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateSubSubCategoryDeleteInput,
  validate,
  deleteSubSubCategory
);

subSubCategoryRouter.put(
  subSubCategoryEndpoints.updatesubSubCategoryStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateSubSubCategoryStatusInput,
  validate,
  updateSubSubCategoryStatus
);

//For User
subSubCategoryRouter.get(
  subSubCategoryEndpoints.getAllActivesubSubCategory,
  verifyTokenUser,
  getAllActiveSubSubCategory
);

module.exports = subSubCategoryRouter;
