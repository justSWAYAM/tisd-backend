import { auth, db } from '../config/firebase-admin.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Signup controller
export const signup = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || !req.body.email || !req.body.password || !req.body.role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, password, and role are required'
            });
        }

        const { email, password, role } = req.body;

        // Validate role
        if (role !== 'student' && role !== 'teacher') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Role must be either "student" or "teacher"'
            });
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
            createdAt: new Date().toISOString(),
            displayName: email.split('@')[0],
            isVerified: false,
            lastLogin: new Date().toISOString()
        });

        // Create role-specific collections
        if (role === 'teacher') {
            await setDoc(doc(db, 'teachers', user.uid), {
                userId: user.uid,
                email: user.email,
                courses: [],
                students: [],
                createdAt: new Date().toISOString()
            });
        } else if (role === 'student') {
            await setDoc(doc(db, 'students', user.uid), {
                userId: user.uid,
                email: user.email,
                enrolledCourses: [],
                progress: {},
                createdAt: new Date().toISOString()
            });
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                uid: user.uid,
                email: user.email,
                role: role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || !req.body.email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email and password are required'
            });
        }

        const { email, password } = req.body;

        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            throw new Error('User data not found');
        }

        const userData = userDoc.data();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                uid: user.uid,
                email: user.email,
                role: userData.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 