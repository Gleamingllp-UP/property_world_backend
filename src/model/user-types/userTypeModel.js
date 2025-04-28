const mongoose = require("mongoose");

const userTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserType = mongoose.model("UserType", userTypeSchema);
module.exports = UserType;
