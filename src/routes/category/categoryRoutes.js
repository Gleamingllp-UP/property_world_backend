const express = require("express");
const {
  CategoryEndpoints,
} = require("../../utils/endpoints/categoryEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
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

module.exports = categoryRouter;
