const express = require("express");
const {
  subCategoryEndpoints,
} = require("../../utils/endpoints/subCategoryEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validateSubCategoryInput,
  validateSubCategoryUpdateInput,
  validateSubCategoryStatusInput,
} = require("../../validators/subCategory");
const { validate } = require("../../middleWares/validate");
const {
  addSubCategory,
  getAllSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
  updateSubCategory
} = require("../../controller/sub-category/subCategoryController");
const { validateCategoryDeleteInput } = require("../../validators/category");

const subCategoryRouter = express.Router();

subCategoryRouter.post(
  subCategoryEndpoints.createsubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "categoryId"]),
  validateSubCategoryInput,
  validate,
  addSubCategory
);

subCategoryRouter.get(
  subCategoryEndpoints.getAllsubCategory,
  verifyTokenAdmin,
  getAllSubCategory
);

subCategoryRouter.put(
  subCategoryEndpoints.updatesubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "categoryId"]),
  validateSubCategoryUpdateInput,
  validate,
  updateSubCategory,
);

subCategoryRouter.delete(
  subCategoryEndpoints.deletesubCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateCategoryDeleteInput,
  validate,
  deleteSubCategory
);

subCategoryRouter.put(
  subCategoryEndpoints.updatesubCategoryStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateSubCategoryStatusInput,
  validate,
  updateSubCategoryStatus
);

module.exports = subCategoryRouter;
