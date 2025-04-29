const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: 22,
      max: 25,
    },
    longitude: {
      type: Number,
      required: true,
      min: 51,
      max: 55,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
