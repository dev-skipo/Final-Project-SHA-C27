const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) return res.status(401).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(verified.id); 
        next(); 
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};