import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();

// middleware
const corsOptions = {
    origin: "http://localhost:5173" // frontend URI (ReactJS)
}

// Configure express to properly handle JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(corsOptions));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload'
        });
    }
    next();
});

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get("/", (req, res) => {
    res.status(201).json({message: "Connected to Backend!"});
    console.log("Connected to Backend!");
});

// Start server
const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

