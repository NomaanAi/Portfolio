import express from 'express';
import * as messageController from '../controllers/messageController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Public route to submit a message
router.post('/', messageController.createMessage);

// Protected routes (require authentication)
router.use(authController.protect);

// User routes
router.get('/my-messages', messageController.getMyMessages);

// Admin routes
router.use(authController.restrictTo('admin'));

router.get('/', messageController.getAllMessages);
router.get('/stats', messageController.getDashboardStats);
router
  .route('/:id')
  .patch(messageController.updateMessageStatus)
  .delete(messageController.deleteMessage);

export default router;
