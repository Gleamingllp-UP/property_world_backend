const mongoose = require("mongoose");
const BlogCategory = require("../blogCategory/blogCategoryModel");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    coverImg: { type: String, required: true },
    blogCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  { timestamps: true }
);

blogPostSchema.pre("save", async function (next) {
  try {
    const blogCategoryExists = await BlogCategory.findById(this.blogCategoryId);
    if (!blogCategoryExists) {
      const err = new Error("Blog Category not found for given Id");
      err.statusCode = 400;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
module.exports = BlogPost;
