const BlogPost = require("../models/BlogPost");

const getAllBlogs = async (req, res) => {
  const blogs = await BlogPost.find().populate("author", "name email role");
  res.json(blogs);
};

const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await BlogPost.findById(id).populate("author", "name email role");
    if (!blog) {
      throw { statusCode: 400, message: `Blog not found with id: ${id}` };
    }
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const blog = await BlogPost.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await BlogPost.findById(id);
    if (!blog) {
      throw { statusCode: 400, message: `Blog not found with id: ${id}` };
    }

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;

    await blog.save();

    res.json(blog);
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await BlogPost.findByIdAndDelete(id);
    if (!blog) {
      throw { statusCode: 400, message: `Blog not found with id: ${id}` };
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};