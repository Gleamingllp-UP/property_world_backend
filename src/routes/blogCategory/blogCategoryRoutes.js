const express = require("express");
const {
  BlogCategoryEndpoints,
} = require("../../utils/endpoints/blogCategoryEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validatorBlogCategoryInput,
  validatorBlogCategoryDeleteInput,
  validatorBlogCategoryStatusInput,
  validatorBlogCategoryUpdateInput,
} = require("../../validators/blogCategory");
const { validate } = require("../../middleWares/validate");
const {
  addBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  deleteBlogCategory,
  updateBlogCategoryStatus,
  getAllDefaulteBlogCategory,
} = require("../../controller/blogCategory/blogCategoryController");

const blogCategoryRouter = express.Router();

blogCategoryRouter.post(
  BlogCategoryEndpoints.createBlogCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validatorBlogCategoryInput,
  validate,
  addBlogCategory
);

blogCategoryRouter.get(
  BlogCategoryEndpoints.getAllBlogCategory,
  verifyTokenAdmin,
  getAllBlogCategory
);

blogCategoryRouter.get(
  BlogCategoryEndpoints.getAllDefaultBlogCategory,
  verifyTokenAdmin,
  getAllDefaulteBlogCategory
);

blogCategoryRouter.put(
  BlogCategoryEndpoints.updateBlogCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validatorBlogCategoryUpdateInput,
  validate,
  updateBlogCategory
);

blogCategoryRouter.delete(
  BlogCategoryEndpoints.deleteBlogCategory,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBlogCategoryDeleteInput,
  validate,
  deleteBlogCategory
);

blogCategoryRouter.put(
  BlogCategoryEndpoints.updateBlogCategoryStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBlogCategoryStatusInput,
  validate,
  updateBlogCategoryStatus
);

module.exports = blogCategoryRouter;
