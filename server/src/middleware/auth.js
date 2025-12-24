import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
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
    return res.status(401).json({ status: "fail", message: 'You are not logged in! Please log in to get access.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ status: "fail", message: 'The user belonging to this token no longer exists.' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ status: "fail", message: 'Invalid token' });
  }
};

// Simple role restriction
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: "fail", message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

export const requireAuth = protect;
export const requireAdmin = restrictTo('admin');


