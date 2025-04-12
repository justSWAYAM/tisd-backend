import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - requires authentication
router.get('/me', authenticateUser, getCurrentUser);

export default router;