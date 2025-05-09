const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const visionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  backgroundImageUrl: { type: String, required: false },
});

const aboutUsSchema = new mongoose.Schema(
  {
    profile: sectionSchema,
    vision: visionSchema,
    mission: sectionSchema,
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
