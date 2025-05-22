const mongoose = require("mongoose");
const UserType = require("../user-types/userTypeModel");

const tempUserSchema = mongoose.Schema(
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
      default: new Date(),
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

    user_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserType",
      required: true,
    },

    is_accepted_privacy_and_policy: {
      type: Boolean,
      require: true,
    },

    is_accepted_terms_and_condition: {
      type: Boolean,
      require: true,
    },

    codeExpires: {
      type: Date,
      reruired: true,
    },
    code: {
      type: Number,
      default: null,
    },
    isVerified: {
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
  },

  {
    timestamps: true,
  }
);

tempUserSchema.pre("save", async (next) => {
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

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = TempUser;
