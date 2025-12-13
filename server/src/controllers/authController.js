import Admin from '../models/Admin.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../utils/appError.js';
// Note: catchAsync is available but we will use explicit try/catch as requested for clarity and robustness in this specific fix pass if needed, 
// though keeping catchAsync for simplicity where it robustly works is fine. 
// However, the user explicitly asked for "Add try/catch blocks", so we will convert to explicit try/catch for the specified controllers to be 100% sure.

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const createSendToken = (user, statusCode, req, res, role = 'user') => {
  const token = signToken(user._id, role);
  const jwtCookieExpiresIn = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 90;
  const cookieOptions = {
    expires: new Date(
      Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  // Remove password from output
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  // Determine redirect URL based on role
  const redirectUrl = role === 'admin'
    ? `${process.env.CLIENT_ORIGIN}/admin`
    : `${process.env.CLIENT_ORIGIN}/`;

  res.status(statusCode).json({
    status: 'success',
    token,
    role: role,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role
      },
      redirectUrl
    },
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // 1) Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
    }

    // 2) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'fail', message: 'Email already in use' });
    }

    // 3) Create new user with default 'user' role
    const newUser = await User.create({
      role: 'user',
      name,
      email,
      password,
    });

    // 3) Log the user in, send JWT
    createSendToken(newUser, 201, req, res, 'user');
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Error during signup',
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password',
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res, 'user');
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message || 'Error during login',
    });
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // 2) Check if admin exists && password is correct (Use Admin Model)
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    // 3) If everything ok, send token to client
    createSendToken(admin, 200, req, res, 'admin');
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ status: 'error', message: err.message || 'Error during admin login' });
  }
};

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user/admin still exists
    let currentUser;
    if (decoded.role === 'admin') {
      currentUser = await Admin.findById(decoded.id);
    } else {
      currentUser = await User.findById(decoded.id);
    }

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    // Ensure role is normalized on req.user for generic checks
    if (!req.user.role && decoded.role) {
      req.user.role = decoded.role;
    }

    res.locals.user = currentUser;
    next();
  } catch (err) {
    console.error('Auth Protect Error:', err);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    // Ensure req.user.role exists (it should from protect)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

export const getProfile = async (req, res, next) => {
  try {
    // req.user is already set by protect
    const user = req.user;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'This route is not for password updates. Please use /updateMyPassword.',
      });
    }

    // 2) Filtered out unwanted field names that are not allowed to be updated
    const { name, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // 3) Update user document based on role
    let updatedUser;
    if (req.user.role === 'admin') {
      updatedUser = await Admin.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id).select('+password');
    } else {
      user = await User.findById(req.user.id).select('+password');
    }

    // 2) Check if POSTed current password is correct
    if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Your current password is wrong',
      });
    }

    // 3) If so, update password
    user.password = req.body.password;
    // user.passwordConfirm = req.body.passwordConfirm; 
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res, req.user.role);
  } catch (err) {
    console.error('Update Password Error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
