import { db } from '../config/firebase-admin.js';

export const updateProfile = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const profileData = req.body;
        
        // Common required fields for both roles
        const commonRequiredFields = ['name'];
        
        // Role-specific required fields
        const roleSpecificFields = {
            student: ['school', 'class', 'age', 'degree'],
            teacher: ['currentOrganization', 'experience', 'qualification', 'mobileNo']
        };
        
        // Validate common fields
        const missingCommonFields = commonRequiredFields.filter(field => !profileData[field]);
        if (missingCommonFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingCommonFields.join(', ')}`
            });
        }
        
        // Validate role-specific fields
        const missingRoleFields = roleSpecificFields[role].filter(field => !profileData[field]);
        if (missingRoleFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields for ${role}: ${missingRoleFields.join(', ')}`
            });
        }
        
        // Validate role
        if (role !== 'student' && role !== 'teacher') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }
        
        // Additional validations for specific fields
        if (role === 'student') {
            // Validate age
            if (isNaN(profileData.age) || profileData.age < 10 || profileData.age > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Age must be between 10 and 100'
                });
            }
            // Validate degree
            const validDegrees = ['BTech/BE', 'SSC', 'HSC'];
            if (!validDegrees.includes(profileData.degree)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid degree selected'
                });
            }
        } else if (role === 'teacher') {
            // Validate experience
            if (isNaN(profileData.experience) || profileData.experience < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Experience must be a positive number'
                });
            }
            // Validate mobile number
            if (!/^\d{10}$/.test(profileData.mobileNo)) {
                return res.status(400).json({
                    success: false,
                    message: 'Mobile number must be 10 digits'
                });
            }
        }
        
        // Update the profile in the respective collection
        const docRef = db.collection(`${role}s`).doc(userId);
        
        await docRef.update({
            ...profileData,
            profileCompleted: true,
            updatedAt: new Date().toISOString()
        });
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile: profileData
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};