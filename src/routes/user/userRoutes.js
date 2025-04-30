const express = require("express");
const { userEndpoints } = require("../../utils/endpoints/userEndpoints");
const {
  addUser,
  userLogin,
  initiateSignup,
  verifyCode,
  setPassword,
} = require("../../controller/user/userController");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validatorInitiateSignUp,
  validatorUserVerifyCodeInput,
  validatorUserSetPasswordInput,
  validatorUserLoginInput,
} = require("../../validators/user");
const { validate } = require("../../middleWares/validate");
const {
  signUpAllowedFields,
  verifyCodeAllowedFields,
  setPasswordAllowedFields,
  userLoginAllowedFields,
} = require("../../utils/validateFields/signUpFields");
const { verifyTokenForTempUser } = require("../../middleWares/TokenVerification/verifyTokenForTempUser");

const userRouter = express.Router();

// userRouter.post(
//   userEndpoints.createUser,
//   validateOnlyAllowedFields(["email", "password"]),
//   validateUserRegisterInput, 
//   validate,
//   addUser
// );

userRouter.post(
  userEndpoints.initiateSignup,
  validateOnlyAllowedFields(signUpAllowedFields),
  validatorInitiateSignUp,
  validate,
  initiateSignup
);

userRouter.post(
  userEndpoints.verifyCode,
  verifyTokenForTempUser,
  validateOnlyAllowedFields(verifyCodeAllowedFields),
  validatorUserVerifyCodeInput,
  validate,
  verifyCode
);

userRouter.post(
  userEndpoints.setPassword,
  verifyTokenForTempUser,
  validateOnlyAllowedFields(setPasswordAllowedFields),
  validatorUserSetPasswordInput,
  validate,
  setPassword
);

userRouter.post(
  userEndpoints.userLogin,
  validateOnlyAllowedFields(userLoginAllowedFields),
  validatorUserLoginInput,
  validate,
  userLogin
);

module.exports = userRouter;
