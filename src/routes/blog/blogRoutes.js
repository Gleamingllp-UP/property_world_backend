const express = require("express");
const { blogEndpoints } = require("../../utils/endpoints/blogEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
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
  updateBlogPostStatus,
  getAllBlogPostForUser,
  getBlogPostByIdForUser,
} = require("../../controller/blog/blogController");
const {
  dynamicSingleImageUpload,
} = require("../../middleWares/fileUpload/uploadFile");

const blogRouter = express.Router();

blogRouter.post(
  blogEndpoints.createblog,
  verifyTokenAdmin,
  dynamicSingleImageUpload("blog_img"),
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
blogRouter.get(blogEndpoints.getAllblogForUser, verifyTokenUser, getAllBlogPostForUser);

blogRouter.get(
  blogEndpoints.getblogForUser,
  verifyTokenUser,
  validatorBlogPostGetByIdInput,
  validate,
  getBlogPostByIdForUser
);

blogRouter.put(
  blogEndpoints.updateblog,
  verifyTokenAdmin,
  dynamicSingleImageUpload("blog_img"),
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
