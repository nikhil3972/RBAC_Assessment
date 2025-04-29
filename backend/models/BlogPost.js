const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required.'],
        validate: {
            validator: function(value) {
                return value.trim().length > 0;
            },
            message: 'Title should not be empty.'
        },
        minlength: [5, 'Title must be at least 5 characters long.']
    },
    content: { 
        type: String, 
        required: [true, 'Content is required.'],
        trim: true,
        validate: {
            validator: function(value) {
                return value && value.trim().length > 0;
            },
            message: 'Content should not be empty.'
        },
        minlength: [5, 'Content must be at least 5 characters long.']
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);