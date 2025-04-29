const { validationResult } = require("express-validator");

// exports.validate = (req, res, next) => {
//   const errors = validationResult(req);
//   console.log('errors',errors)
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       message:errors.array()?.[0]?.msg,
//       errors: errors.array(), // we can also add errors.array()[0] for first error
//       success: false,
//     });
//   }
//   next();
// };

exports.validate = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()?.[0]?.msg,
        errors: errors.array(),
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error during validation",
      error: error.message,
      success: false,
    });
  }
};
