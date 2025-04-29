const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      role: role._id
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: role.name
      }
    });
  } catch (err) {
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

module.exports = { register, login };
