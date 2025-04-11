import { auth } from '../config/firebase-admin.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-admin.js';

export const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(token);
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', decodedToken.uid));
        if (!userDoc.exists()) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const userData = userDoc.data();
        
        req.user = {
            userId: decodedToken.uid,
            email: decodedToken.email,
            role: userData.role
        };
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
}; 