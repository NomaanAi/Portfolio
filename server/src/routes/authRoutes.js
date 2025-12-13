import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
router.use(authController.protect);

// Get current user
// Get current user
router.get('/me', authController.protect, authController.getProfile);
router.patch('/updateMe', authController.protect, authController.updateProfile);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

export default router;
