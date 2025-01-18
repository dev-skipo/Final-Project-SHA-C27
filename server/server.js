const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const pageRoutes = require('./routes/pageRoutes'); // Page routes
const subscriptionRoutes = require('./routes/subscriptionRoutes'); // Subscription routes

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));
console.log('Resolved path:', path.join(__dirname, '../client/build'));


// Use API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/pages', pageRoutes); // Page routes
app.use('/api/subscribe', subscriptionRoutes); // Subscription routes
app.use('/api/subscriptions', subscriptionRoutes);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});