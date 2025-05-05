const express = require("express");
const { blogEndpoints } = require("../../utils/endpoints/blogEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { blogAllowedFields } = require("../../utils/validateFields/blogFields");
const {
  validatorBlogPostAddInput,
  validatorBlogPostUpdateInput,
  validatorBlogPostGetByIdInput,
  validatorBlogPostUpdateStatusIdInput,
  validatorBlogPostDeleteInput,
} = require("../../validators/blog");
const { validate } = require("../../middleWares/validate");
const {
  addBlogPost,
  getAllBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
  updateBlogPostStatus
} = require("../../controller/blog/blogController");

const blogRouter = express.Router();

blogRouter.post(
  blogEndpoints.createblog,
  verifyTokenAdmin,
  validateOnlyAllowedFields(blogAllowedFields),
  validatorBlogPostAddInput,
  validate,
  addBlogPost
);

blogRouter.get(blogEndpoints.getAllblog, verifyTokenAdmin, getAllBlogPost);

blogRouter.get(
  blogEndpoints.getblog,
  verifyTokenAdmin,
  validatorBlogPostGetByIdInput,
  validate,
  getBlogPostById
);

blogRouter.put(
  blogEndpoints.updateblog,
  verifyTokenAdmin,
  validateOnlyAllowedFields(blogAllowedFields),
  validatorBlogPostUpdateInput,
  validate,
  updateBlogPost
);

blogRouter.put(
  blogEndpoints.updateblogStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBlogPostUpdateStatusIdInput,
  validate,
  updateBlogPostStatus
);

blogRouter.delete(
  blogEndpoints.deleteblog,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorBlogPostDeleteInput,
  validate,
  deleteBlogPost
);

module.exports = blogRouter;
