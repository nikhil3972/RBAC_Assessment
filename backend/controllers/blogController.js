const BlogPost = require('../models/BlogPost');

const getAllBlogs = async (req, res) => {
    const blogs = await BlogPost.find().populate('author', 'name email role');
    res.json(blogs);
};

const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await BlogPost.findById(id).populate('author', 'name email role');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBlog = async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const blog = await BlogPost.create({
        title,
        content,
        author: req.user._id
    });

    res.status(201).json(blog);
};

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    await blog.save();

    res.json(blog);
};

const deleteBlog = async (req, res) => {
    const { id } = req.params;

    const blog = await BlogPost.findByIdAndDelete(id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json({ message: 'Blog deleted successfully' });
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };