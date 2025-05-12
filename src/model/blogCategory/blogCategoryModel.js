const mongoose = require("mongoose");

const blogCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
module.exports = BlogCategory;
