import express from 'express';
import { updateProfile } from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile routes
router.put('/update', authenticateUser, updateProfile);

export default router; 