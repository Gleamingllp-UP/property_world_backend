const express = require("express");
const { userEndpoints } = require("../../utils/endpoints/userEndpoints");
const { addUser, userLogin } = require("../../controller/user/userController");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { validateUserRegisterInput } = require("../../validators/user");
const { validate } = require("../../middleWares/validate");

const userRouter = express.Router();

userRouter.post(
  userEndpoints.createUser,
  validateOnlyAllowedFields[("email", "password")],
  validateUserRegisterInput,
  validate,
  addUser
);

userRouter.post(
  userEndpoints.userLogin,
  validateOnlyAllowedFields[("email", "password")],
  validateUserRegisterInput,
  validate,
  userLogin
);

module.exports = userRouter;
