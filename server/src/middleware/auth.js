import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

import Admin from '../models/Admin.js';

// Protect routes - user must be logged in
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header or cookie
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
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user/admin still exists
  let currentUser;

  if (decoded.role === 'admin') {
    currentUser = await Admin.findById(decoded.id);
  } else {
    currentUser = await User.findById(decoded.id);
  }

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued (Only for User model usually, Admin logic optional)
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  // If it's an admin, ensure role is set on the object for middleware checks
  if (decoded.role === 'admin') req.user.role = 'admin';

  res.locals.user = currentUser;
  next();
});

// Restrict routes to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

// Check if user is logged in, only for rendered pages, no errors
export const isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      let currentUser;
      if (decoded.role === 'admin') {
        currentUser = await Admin.findById(decoded.id);
      } else {
        currentUser = await User.findById(decoded.id);
      }

      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

// Check if user is authenticated for API requests
export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in! Please log in to get access.'
    });
  }
  next();
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    status: 'error',
    message: 'Admin access required.'
  });
};
