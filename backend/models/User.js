const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required.'],
    validate: {
        validator: function(value) {
            return value.trim().length > 0;
        },
        message: 'Name should not be empty.'
    },
    minlength: [3, 'Name must be at least 3 characters long.'],
    maxlength: [100, 'Name cannot exceed 100 characters.'],
  },
  email: { 
    type: String, 
    required: [true, 'Email is required.'], 
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email format.',
    }
  },
  password: { 
    type: String, 
    required: [true, 'Password is required.'], 
    minlength: [8, 'Password must be at least 8 characters long.'],
    maxlength: [128, 'Password cannot exceed 128 characters.'],
  },
  isVerified: { type: Boolean, default: false },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: [true, 'Role is required.'],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
