import { db } from '../config/firebase-admin.js';

export const getCurrentUser = async (req, res) => {
    try {
        const { userId } = req.user;

        // Get user data from users collection
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userData = userDoc.data();
        const { role } = userData;

        // Get role-specific data
        const roleDoc = await db.collection(`${role}s`).doc(userId).get();
        if (!roleDoc.exists) {
            return res.status(404).json({
                success: false,
                message: `${role} profile not found`
            });
        }

        const roleData = roleDoc.data();

        res.status(200).json({
            success: true,
            user: {
                ...userData,
                ...roleData,
                uid: userId
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};