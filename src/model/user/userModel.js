const mongoose = require("mongoose");
const UserType = require("../user-types/userTypeModel");

const userSchema = mongoose.Schema(
  {
     first_name: {
       type: String,
       required: true,
     },
     last_name: {
       type: String,
       required: true,
     },
     country_code: {
       type: Number,
       required: true,
     },
     phone_number: {
       type: Number,
       required: true,
       unique: true,
     },
     dob: {
       type: Date,
       required: true,
     },
     country_of_residance: {
       type: String,
       required: true,
     },
     email: {
       type: String,
       required: true,
       unique: true,
     },
     password: {
       type: String,
       required: true,
     },
     user_type: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "UserType",
       required: true,
     },
 
     tokenVersion: {
       type: Number,
       default: 0,
     },
     is_accepted_privacy_and_policy: {
       type: Boolean,
       require: true,
     },
     is_accepted_terms_and_condition: {
       type: Boolean,
       require: true,
     },
     is_user_verified: {
       type: Boolean,
       default: false,
     },
     is_email_verified: {
       type: Boolean,
       default: false,
     },
     is_phone_verified: {
       type: Boolean,
       default: false,
     },
     is_blocked: {
       type: Boolean,
       default: false,
     },
   },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async (next) => {
  try {
    const isUserTypeExist = UserType.exists({ _id: this.user_type });

    if (!isUserTypeExist) {
      return next(new Error("User Type is not exists"));
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
