const BlogPost = require("../../model/blog/blogModel");

exports.addBlogPost = async (req, res) => {
  try {
    const { title, content, author, category, coverImg } = req.body;
    const blogPost = new BlogPost({
      title,
      content,
      author,
      category,
      coverImg,
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
    let { page = 1, limit = 10 } = req.params;

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const blogPost = await BlogPost.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BlogPost.countDocuments();

    if (blogPost) {
      return res.status(200).json({
        message: "Blog post retrieved successfully",
        status: 200,
        success: true,
        data: blogPost,
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
    const { title, content, author, category, coverImg } = req.body;
    const updateData = {
      title,
      content,
      author,
      category,
      coverImg,
    };
    const blogPost = await BlogPost.findById(blogPostId);

    if (!blogPost) {
      return res.status(404).json({
        message: "Blog post not found",
        status: 404,
        success: false,
      });
    }
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
