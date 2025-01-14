const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, category, username } = req.body; 


    if (!name || !email || !password || !category || !username) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
       
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, category, username });
        
        
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error registering user:", error); 
        res.status(500).json({ message: 'Error registering user', error: error.message }); 
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, category, username, password } = req.body;
    const updates = { name, email, category, username };

    try {
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the request
        await User.findByIdAndDelete(userId); // Delete the user from the database
        res.status(200).json({ message: 'User account deleted successfully.' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};