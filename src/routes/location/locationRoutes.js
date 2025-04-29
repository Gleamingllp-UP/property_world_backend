const express = require("express");
const {
  LocationEndpoints,
} = require("../../utils/endpoints/locationEndpoints");
const {
  verifyTokenAdmin,
} = require("../../middleWares/TokenVerification/verifyTokenAdmin");
const {
  validateOnlyAllowedFields,
} = require("../../middleWares/validateOnlyAllowedFields");
const {
  validatorLocationInput,
  validatorLocationUpdateInput,
  validatorLocationDeleteInput,
  validatorLocationUpdateStatus,
} = require("../../validators/location");
const { validate } = require("../../middleWares/validate");
const {
  addLocation,
  getAllLocation,
  updateLocation,
  deleteLocation,
  updateLocationStatus,
} = require("../../controller/location/locationController");
const locationRouter = express.Router();

locationRouter.post(
  LocationEndpoints.createLocation,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "pincode", "longitude", "latitude"]),
  validatorLocationInput,
  validate,
  addLocation
);

locationRouter.get(
  LocationEndpoints.getAllLocation,
  verifyTokenAdmin,
  getAllLocation
);

locationRouter.put(
  LocationEndpoints.updateLocation,
  verifyTokenAdmin,
  validateOnlyAllowedFields(["name", "pincode", "longitude", "latitude"]),
  validatorLocationUpdateInput,
  validate,
  updateLocation
);

locationRouter.delete(
  LocationEndpoints.deleteLocation,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorLocationDeleteInput,
  validate,
  deleteLocation
);

locationRouter.put(
  LocationEndpoints.updateLocationStatus,
  verifyTokenAdmin,
  validateOnlyAllowedFields([]),
  validatorLocationUpdateStatus,
  validate,
  updateLocationStatus
);

module.exports = locationRouter;
