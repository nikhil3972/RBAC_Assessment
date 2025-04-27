const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, getAllBlogs);
router.get('/:id', protect, authorizeRoles('admin'), getBlogById);
router.post('/', protect, authorizeRoles('admin'), createBlog);
router.put('/:id', protect, authorizeRoles('admin'), updateBlog);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBlog);

module.exports = router;