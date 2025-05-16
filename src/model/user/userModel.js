const mongoose = require("mongoose");
const UserType = require("../user-types/userTypeModel");
const Property = require("../../model/property/propertyModel");

const options = { discriminatorKey: "user_type", timestamps: true };

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
    saved_properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    liked_properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    is_accepted_privacy_and_policy: {
      type: Boolean,
      require: true,
    },
    is_accepted_terms_and_condition: {
      type: Boolean,
      require: true,
    },
    is_user_verified_by_admin: {
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  options
);

userSchema.pre("save", async (next) => {
  try {
    const isUserTypeExist = UserType.exists({ _id: this.user_type });

    if (!isUserTypeExist) {
      return next(new Error("User Type is not exists"));
    }

    if (this.saved_properties && this.saved_properties.length > 0) {
      const savedPropsCount = await Property.countDocuments({
        _id: { $in: this.saved_properties },
      });

      if (savedPropsCount !== this.saved_properties.length) {
        return next(new Error("One or more saved properties do not exist"));
      }
    }

    if (this.liked_properties && this.liked_properties.length > 0) {
      const likedPropsCount = await Property.countDocuments({
        _id: { $in: this.liked_properties },
      });

      if (likedPropsCount !== this.liked_properties.length) {
        return next(new Error("One or more liked properties do not exist"));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
