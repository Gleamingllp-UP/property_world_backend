const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["privacy_policy", "terms_and_conditions", "cookies_policy"],
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Policy = mongoose.model("Policy", policySchema);

module.exports = Policy;
