const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
