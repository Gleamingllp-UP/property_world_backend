exports.signUpAllowedFields = [
  "first_name",
  "last_name",
  "country_code",
  "phone_number",
  "dob",
  "country_of_residance",
  "email",
  "user_type",
  "is_accepted_privacy_and_policy",
  "is_accepted_terms_and_condition",
];

exports.verifyCodeAllowedFields = ["email", "code"];
exports.setPasswordAllowedFields = ["email", "password"];
exports.userLoginAllowedFields = ["email", "password"];
