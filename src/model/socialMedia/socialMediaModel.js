const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
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
const SocialMedia = mongoose.model("socialMedia", socialMediaSchema);
module.exports = SocialMedia;
