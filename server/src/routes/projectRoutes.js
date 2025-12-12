import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { uploadMultipleImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);

// Protected routes (require authentication)
router.use(protect);

// Admin-only routes
router.use(restrictTo('admin'));

// Project CRUD operations
router.post('/', projectController.createProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Image upload routes
router.post(
  '/:id/images',
  uploadMultipleImages,
  projectController.uploadProjectImages
);
router.delete(
  '/:id/images/:imageId',
  projectController.deleteProjectImage
);

export default router;
