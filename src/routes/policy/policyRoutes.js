const express = require("express");
const { policyEndpoints } = require("../../utils/endpoints/policyEndpoints");

const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  verifyTokenUser,
} = require("../../middleWares/TokenVerification/verifyTokenUser");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const { validate } = require("../../middleWares/validate");
const {
  validatorPolicyCreate,
  validatorPolicyUpdate,
  validatorPolicyDelete,
} = require("../../validators/policy");
const {
  addPolicy,
  getPolicyByType,
  updatePolicy,
  deletePolicy,
  getPolicyByTypeForUser,
} = require("../../controller/policy/policyController");
const {
  policyAllowedFields,
} = require("../../utils/validateFields/policyFields");

const policyRouter = express.Router();

policyRouter.post(
  policyEndpoints.createPolicy,
  verifyTokenAdmin,
  validateOnlyAllowedFields(policyAllowedFields),
  validatorPolicyCreate,
  validate,
  addPolicy
);

policyRouter.get(
  policyEndpoints.getPolicyByType,
  verifyTokenAdmin,
  getPolicyByType
);

policyRouter.put(
  policyEndpoints.updatePolicy,
  verifyTokenAdmin,
  validateOnlyAllowedFields(policyAllowedFields),
  validatorPolicyUpdate,
  validate,
  updatePolicy
);

policyRouter.delete(
  policyEndpoints.deletePolicy,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorPolicyDelete,
  validate,
  deletePolicy
);

policyRouter.get(
  policyEndpoints.getPolicyByTypeForUser,
  verifyTokenUser,
  getPolicyByTypeForUser
);

module.exports = policyRouter;
