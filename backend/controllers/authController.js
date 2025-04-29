const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/transporter');

const register = async (req, res, next) => {
  try {
    const { name, email, password, roleName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { statusCode: 400, message: 'User already exists' };
    }

    const role = await Role.findOne({ name: roleName || 'user' });
    if (!role) {
      throw { statusCode: 400, message: `Role not found: ${roleName || 'user'}` };
    }

    if (!password || password.length < 8 || password.length > 128) {
      throw { statusCode: 400, message: 'Password must be between 8 and 128 characters.' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role._id,
      isVerified: false
    });

    const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${emailToken}`;

    await transporter.sendMail({
      from: '"Blog Auth" <dethenikhil7578@gmail.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Hello ${name},</p>
             <p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`
    });

    res.status(201).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token or user not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Verification link has expired' });
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      throw { statusCode: 400, message: 'User not found, please register.' };
    }

    if (!user.isVerified) {
      throw { statusCode: 403, message: 'Please verify your email before logging in.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Invalid password.' };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role.name
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, verifyEmail, login };
