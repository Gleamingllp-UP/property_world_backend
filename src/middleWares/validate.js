const { validationResult } = require("express-validator");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(), // we can also add errors.array()[0] for first error
      success: false,
    });
  }
  next();
};
