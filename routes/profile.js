import express from 'express';
import { updateStudentProfile, updateTeacherProfile } from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile routes with role-specific endpoints
router.put('/student/update', authenticateUser, updateStudentProfile);
router.put('/teacher/update', authenticateUser, updateTeacherProfile);

export default router;