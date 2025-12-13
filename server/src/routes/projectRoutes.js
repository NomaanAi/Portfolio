import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadMultipleImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);

// Protected routes (require authentication)
router.use(requireAuth);

// Admin-only routes
router.use(requireAdmin);

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
