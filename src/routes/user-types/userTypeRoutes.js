const express = require("express");
const {
  userTypeEndpoints,
} = require("../../utils/endpoints/userTypeEndpoints");
const {
  addUserType,
  getAllUserType,
  updateUserType,
  deleteUserType,
  updateUserTypeStatus,
  getAllUserTypeForUser,
} = require("../../controller/user-types/userTypeController");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validateUserTypeInput,
  validateUserTypeUpdateInput,
  validateUserTypeDeleteInput,
  validateUserTypeStatusInput,
} = require("../../validators/userType");
const { validate } = require("../../middleWares/validate");
const userTypeRouter = express.Router();

userTypeRouter.post(
  userTypeEndpoints.createUserType,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validateUserTypeInput,
  validate,
  addUserType
);

userTypeRouter.get(
  userTypeEndpoints.getAllUserType,
  verifyTokenAdmin,
  getAllUserType
);

userTypeRouter.get(
  userTypeEndpoints.getAllActiveUserType,
  getAllUserTypeForUser
);

userTypeRouter.put(
  userTypeEndpoints.updateUserType,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name"]),
  validateUserTypeUpdateInput,
  validate,
  updateUserType
);

userTypeRouter.delete(
  userTypeEndpoints.deleteUserType,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateUserTypeDeleteInput,
  validate,
  deleteUserType
);

userTypeRouter.put(
  userTypeEndpoints.updateUserTypeStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validateUserTypeStatusInput,
  validate,
  updateUserTypeStatus
);

module.exports = userTypeRouter;
