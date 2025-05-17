const express = require("express");
const {
  CategoryEndpoints,
} = require("../../utils/endpoints/categoryEndpoints");
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
  validateCategoryInput,
  validateCategoryUpdateInput,
  validateCategoryDeleteInput,
  validateCategoryStatusInput,
} = require("../../validators/category");
const { validate } = require("../../middleWares/validate");
const {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getAllActiveCategory,
} = require("../../controller/category/categoryController");

const categoryRouter = express.Router();

categoryRouter.post(
  CategoryEndpoints.createCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validateCategoryInput,
  validate,
  addCategory
);

categoryRouter.get(
  CategoryEndpoints.getAllCategory,
  verifyTokenAdmin,
  getAllCategory
);

categoryRouter.put(
  CategoryEndpoints.updateCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validateCategoryUpdateInput,
  validate,
  updateCategory
);

categoryRouter.delete(
  CategoryEndpoints.deleteCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateCategoryDeleteInput,
  validate,
  deleteCategory
);

categoryRouter.put(
  CategoryEndpoints.updateCategoryStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateCategoryStatusInput,
  validate,
  updateCategoryStatus
);

categoryRouter.put(
  CategoryEndpoints.updateCategoryStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateCategoryStatusInput,
  validate,
  updateCategoryStatus
);

categoryRouter.get(
  CategoryEndpoints.getAllActiveCategory,
  verifyTokenUser,
  getAllActiveCategory
);

module.exports = categoryRouter;
