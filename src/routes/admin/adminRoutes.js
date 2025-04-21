const express = require("express");
const {
  adminRegistration,
  adminLogin,
  updatePassword,
  forgetPassword,
  resetPassword,
} = require("../../controller/admin/adminController");
const { adminEndpoints } = require("../../utils/endpoints/adminEndpoints");
const {
  validateRegisterInput,
  validateInputForPassword,
  validateInputForForgetPassword,
  validateInputForResetPassword,
} = require("../../validators/admin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { validate } = require("../../middleWares/validate");
const { verifyToken } = require("../../middleWares/verifyToken");

const adminRouter = express.Router();

adminRouter.post(
  adminEndpoints.registerAdmin,
  validateOnlyAllowedFields(["email", "password"]),
  validateRegisterInput,
  validate,
  adminRegistration
);

adminRouter.post(
  adminEndpoints.loginAdmin,
  validateOnlyAllowedFields(["email", "password"]),
  validateRegisterInput,
  validate,
  adminLogin
);

adminRouter.post(
  adminEndpoints.updatePassword,
  verifyToken,
  validateOnlyAllowedFields(["email", "newPassword"]),
  validateInputForPassword,
  validate,
  updatePassword
);

adminRouter.post(
  adminEndpoints.forgetPassword,
  verifyToken,
  validateOnlyAllowedFields(["email"]),
  validateInputForForgetPassword,
  validate,
  forgetPassword
);

adminRouter.put(
  adminEndpoints.resetPassword,
  validateOnlyAllowedFields(["newPassword"]),
  validateInputForResetPassword,
  validate,
  resetPassword
);

module.exports = adminRouter;
