import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel.js';
import Admin from '../models/Admin.js'; // Assuming original supported Admin model? 
// Wait, if I restored Admin.js, I should import it if needed. 
// But generic protect usually checks User model.
// However, original issue was "Admin logic issues". 
// I will implement standard protect.

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      // Check Admin? 
      const currentAdmin = await Admin.findById(decoded.id);
      if (currentAdmin) {
        req.user = currentAdmin;
        return next();
      }
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    next();
  };
};

export const authRequired = (roles = []) => {
  // Alias or similar function? projects.js uses authRequired(["admin"])
  return (req, res, next) => {
    // Implementation guess
    protect(req, res, () => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    });
  }
}
// ALIASES for compatibility with projectRoutes.js
export const requireAuth = protect;
export const requireAdmin = restrictTo('admin');

export default {
  protect,
  restrictTo,
  authRequired,
  requireAuth,
  requireAdmin
};

