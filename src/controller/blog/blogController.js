const BlogPost = require("../../model/blog/blogModel");
const {
  uploadImageOnAwsReturnUrl,
} = require("../../utils/functions/uploadFilesOnAws");
const BlogCategory = require("../../model/blogCategory/blogCategoryModel");
const mongoose = require("mongoose");

exports.addBlogPost = async (req, res) => {
  try {
    const { title, content, author, blog_img, blog_category_id } = req.body;
    const file = req.files?.blog_img?.[0];

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        status: 400,
      });
    }

    const isBlogCategoryExist = await BlogCategory.findById(blog_category_id);
    if (!isBlogCategoryExist) {
      return res.status(400).json({
        message: "Blog Category does not exist",
        status: 400,
        success: false,
      });
    }

    let blogImageBase64 = null;
    if (blog_img) {
      blogImageBase64 = blog_img;
    } else if (file) {
      blogImageBase64 = await uploadImageOnAwsReturnUrl(file);
    }

    const blogPost = new BlogPost({
      title,
      content,
      author,
      blogCategoryId: blog_category_id,
      coverImg: blogImageBase64,
    });

    const blogResult = await blogPost.save();

    if (!blogResult) {
      return res.status(400).json({
        message: "Failed to add post",
        status: 400,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Blog post added successfully",
      data: blogResult,
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getAllBlogPost = async (req, res) => {
  try {
    let { page = 1, limit = 10, blog_category_id } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const filter = {};

    if (blog_category_id && mongoose.Types.ObjectId.isValid(blog_category_id)) {
      filter.blogCategoryId = new mongoose.Types.ObjectId(
        String(blog_category_id)
      );
    }

    const blogResult = await BlogPost.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "blogcategories",
          localField: "blogCategoryId",
          foreignField: "_id",
          as: "blog_category",
        },
      },
      //$unwind fails when blog_category is empty or missing so we can use like this
      { $unwind: { path: "$blog_category", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          blogCategory: {
            _id: "$blog_category._id",
            name: "$blog_category.name",
            status: "$blog_category.status",
          },
        },
      },
      { $unset: ["blog_category", "blogCategoryId"] },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await BlogPost.countDocuments(filter);

    if (blogResult) {
      return res.status(200).json({
        message: "Blog post retrieved successfully",
        status: 200,
        success: true,
        data: blogResult,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const blogPost = await BlogPost.findById(blogPostId);
    if (blogPost) {
      return res.status(200).json({
        message: "Blog post retrieved successfully",
        status: 200,
        success: true,
        data: blogPost,
      });
    } else {
      return res.status(404).json({
        message: "Blog post not found",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const { title, content, author, blog_category_id, blog_img } = req.body;

    const blogPost = await BlogPost.findById(blogPostId);

    if (!blogPost) {
      return res.status(404).json({
        message: "Blog post not found",
        status: 404,
        success: false,
      });
    }

    let blogImageBase64 = null;
    if (blog_img) {
      blogImageBase64 = blog_img;
    } else {
      const file = req.files?.blog_img?.[0];
      blogImageBase64 = await uploadImageOnAwsReturnUrl(file);
    }

    const updateData = {
      title,
      content,
      author,
      blogCategoryId: blog_category_id,
      coverImg: blogImageBase64,
    };

    const updatedPost = await BlogPost.findByIdAndUpdate(
      blogPostId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (updatedPost) {
      return res.status(200).json({
        message: "Blog post updated successfully",
        status: 200,
        success: true,
        data: updatedPost,
        id: blogPostId,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.id;
    const blogPost = await BlogPost.findById(blogPostId);
    if (!blogPost) {
      return res.status(404).json({
        message: "Blog post not found",
        status: 404,
        success: false,
      });
    }
    await BlogPost.findByIdAndDelete(blogPostId);
    return res.status(200).json({
      message: "Blog post deleted successfully",
      status: 200,
      success: true,
      data: blogPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateBlogPostStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      return res.status(404).json({
        message: "Blog post not found",
        status: 404,
        success: false,
      });
    }

    const updatedStatus = !blogPost.status;
    const result = await BlogPost.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "Blog post status updated successfully",
        id: id,
        status: 200,
        success: true,
        data: result,
      });
    } else {
      return res.status(500).json({
        message: "Error updating blog",
        status: 500,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};
