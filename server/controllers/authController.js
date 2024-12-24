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


