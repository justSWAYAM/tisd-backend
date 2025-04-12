import { db } from '../config/firebase-admin.js';

// Update student profile
export const updateStudentProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const profileData = req.body;

        console.log('Received student profile update request:', { userId, profileData });

        // Verify user role matches endpoint
        if (role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You must be a student to update student profile'
            });
        }

        // Required fields for student
        const requiredFields = ['name', 'school', 'class', 'age', 'degree'];
        
        // Validate fields
        const missingFields = requiredFields.filter(field => !profileData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Student-specific data validation
        if (isNaN(profileData.age) || profileData.age < 10 || profileData.age > 100) {
            return res.status(400).json({
                success: false,
                message: 'Age must be between 10 and 100'
            });
        }
        
        const validDegrees = ['BTech/BE', 'SSC', 'HSC'];
        if (!validDegrees.includes(profileData.degree)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid degree selected'
            });
        }

        // Update profile in Firestore
        await db.collection('students').doc(userId).update({
            ...profileData,
            profileCompleted: true,
            updatedAt: new Date().toISOString()
        });
        
        res.status(200).json({
            success: true,
            message: 'Student profile updated successfully',
            profile: profileData
        });
    } catch (error) {
        console.error('Student profile update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const profileData = req.body;

        console.log('Received teacher profile update request:', { userId, profileData });

        // Verify user role matches endpoint
        if (role === "student") {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You must be a teacher to update teacher profile'
            });
        }

        // Required fields for teacher
        const requiredFields = ['name', 'currentOrganization', 'experience', 'qualification', 'mobileNo'];
        
        // Validate fields
        const missingFields = requiredFields.filter(field => !profileData[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Teacher-specific data validation
        if (isNaN(profileData.experience) || profileData.experience < 0) {
            return res.status(400).json({
                success: false,
                message: 'Experience must be a positive number'
            });
        }
        
        if (!/^\d{10}$/.test(profileData.mobileNo)) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number must be 10 digits'
            });
        }

        // Update profile in Firestore
        await db.collection('teachers').doc(userId).update({
            ...profileData,
            profileCompleted: true,
            updatedAt: new Date().toISOString()
        });
        
        res.status(200).json({
            success: true,
            message: 'Teacher profile updated successfully',
            profile: profileData
        });
    } catch (error) {
        console.error('Teacher profile update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};