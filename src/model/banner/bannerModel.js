const mongoose = require("mongoose");
const { bannerAllowedTypes } = require("../../utils/validateFields/bannerFields");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: bannerAllowedTypes,
      default: "home_page",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
