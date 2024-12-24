const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Use express.json() to parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/authRoutes'); // Ensure this path is correct
const pageRoutes = require('./routes/pageRoutes'); // Ensure this path is correct

// Use routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/pages', pageRoutes); // Page routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});