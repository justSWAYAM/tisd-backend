// import { auth, db } from '../config/firebase-admin.js';

// // Signup controller
// export const signup = async (req, res) => {
//     try {
//         // Validate request body
//         if (!req.body || !req.body.email || !req.body.password || !req.body.role) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: email, password, and role are required'
//             });
//         }

//         const { email, password, role } = req.body;

//         // Validate role
//         if (role !== 'student' && role !== 'teacher') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid role. Role must be either "student" or "teacher"'
//             });
//         }

//         // Create user using Admin SDK
//         const userRecord = await auth.createUser({
//             email: email,
//             password: password
//         });
        
//         // Store user data in Firestore
//         await db.collection('users').doc(userRecord.uid).set({
//             email: userRecord.email,
//             role: role,
//             createdAt: new Date().toISOString(),
//             displayName: email.split('@')[0],
//             isVerified: false,
//             lastLogin: new Date().toISOString()
//         });

//         // Create role-specific collections
//         if (role === 'teacher') {
//             await db.collection('teachers').doc(userRecord.uid).set({
//                 userId: userRecord.uid,
//                 email: userRecord.email,
//                 courses: [],
//                 students: [],
//                 createdAt: new Date().toISOString()
//             });
//         } else if (role === 'student') {
//             await db.collection('students').doc(userRecord.uid).set({
//                 userId: userRecord.uid,
//                 email: userRecord.email,
//                 enrolledCourses: [],
//                 progress: {},
//                 createdAt: new Date().toISOString()
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: 'User created successfully',
//             user: {
//                 uid: userRecord.uid,
//                 email: userRecord.email,
//                 role: role
//             }
//         });
//     } catch (error) {
//         console.error('Signup error:', error);
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Login controller
// export const login = async (req, res) => {
//     try {
//         // Validate request body
//         if (!req.body || !req.body.email || !req.body.password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: email and password are required'
//             });
//         }

//         const { email, password } = req.body;

//         // Sign in using Admin SDK
//         const userRecord = await auth.getUserByEmail(email);
        
//         // Get user role from Firestore
//         const userDoc = await db.collection('users').doc(userRecord.uid).get();
//         if (!userDoc.exists) {
//             throw new Error('User data not found');
//         }

//         const userData = userDoc.data();

//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             user: {
//                 uid: userRecord.uid,
//                 email: userRecord.email,
//                 role: userData.role
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };