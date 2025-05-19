const express = require("express");
const { userEndpoints } = require("../../utils/endpoints/userEndpoints");
const {
  userLogin,
  initiateSignup,
  verifyCode,
  setPassword,
  getAllUsers,
  initiateSignupByAdmin,
  updateUserStatusWithKey,
  getUserAllDetails,
  guestUserLogin,
} = require("../../controller/user/userController");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validatorInitiateSignUp,
  validatorUserVerifyCodeInput,
  validatorUserSetPasswordInput,
  validatorUserLoginInput,
  validatorUserStatusWithKeyInput,
} = require("../../validators/user");
const { validate } = require("../../middleWares/validate");
const {
  signUpAllowedFields,
  verifyCodeAllowedFields,
  setPasswordAllowedFields,
  userLoginAllowedFields,
} = require("../../utils/validateFields/signUpFields");
const {
  verifyTokenForTempUser,
} = require("../../middleWares/TokenVerification/verifyTokenForTempUser");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");

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
  userEndpoints.initiateSignupByAdmin,
  verifyTokenAdmin,
  validateOnlyAllowedFields(signUpAllowedFields),
  validatorInitiateSignUp,
  validate,
  initiateSignupByAdmin
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

userRouter.put(
  userEndpoints.updateUserStatusWithKey,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["key"]),
  validatorUserStatusWithKeyInput,
  validate,
  updateUserStatusWithKey
);

userRouter.get(userEndpoints.getAllUser, verifyTokenAdmin, getAllUsers);
userRouter.get(
  userEndpoints.getUserAllDetails,
  verifyTokenUser,
  getUserAllDetails
);
userRouter.post(
  userEndpoints.guestUserLogin,
  guestUserLogin
);

module.exports = userRouter;
