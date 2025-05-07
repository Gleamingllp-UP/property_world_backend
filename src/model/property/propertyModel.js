const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
  },
  fullDescription: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    // Property Type
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  area: {
    type: Number, // In sqft or sqm
    required: true,
  },
  furnished: {
    type: String,
    enum: ["Furnished", "Unfurnished", "Semi-Furnished"],
    default: "Unfurnished",
  },
  tourTypes: [
    {
      type: String,
      enum: ["Video Tour", "Floor Plan", "3D Tour"],
    },
  ],
  location: {
    address: { type: String, required: true },
    city: { type: String, default: "Dubai" },
    areaName: { type: String, required: true }, // e.g., Jumeirah, Dubai Marina
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent", // or Agency model
    required: true,
  },
  images: [
    {
      url: String,
      alt: String,
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  keywords: [String],
  product_status: {
    type: String,
    enum: [true, false],
    default: true,
  },
  status: {
    type: String,
    enum: ["Available", "Sold", "Rented"],
    default: "Available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

propertySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Property", propertySchema);
