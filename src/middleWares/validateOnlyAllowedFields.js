exports.validateOnlyAllowedFields = (allowedFields) => (req, res, next) => {

  if (!req.body || typeof req.body !== 'object') {
    return next();  
  }

  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    if (invalidFields.length > 1) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")}`,
        error: `This fields: ${invalidFields.join(", ")} are not allowed`,
        success: false,
      });
    } else {
      return res.status(400).json({
        message: `Invalid field: ${invalidFields.join(", ")}`,
        error: `This field: ${invalidFields.join(", ")} is not allowed`,
        success: false,
      });
    }
  }

  next();
};
