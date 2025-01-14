const Page = require('../models/Page');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
});

const upload = multer({ storage });

// Create a new page
exports.createPage = async (req, res) => {
    const { title, description, backgroundColor, textColor } = req.body; 
    const profileImage = req.file ? req.file.filename : null; // Use filename instead of path

    // Parse links from req.body.links if they are sent as an array of objects
    let links = [];
    if (req.body.links) {
        links = Array.isArray(req.body.links) ? req.body.links : Object.values(req.body.links);
    }

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    if (!Array.isArray(links)) {
        return res.status(400).json({ message: 'Links must be an array.' });
    }

    try {
        const existingPage = await Page.findOne({ userId: req.user.id });

        if (existingPage) {
            return res.status(403).json({ message: 'You can only create one page.' }); 
        }

        const newPage = new Page({
            title,
            description,
            links,
            userId: req.user.id,
            profileImage, // Save only the filename
            backgroundColor, // Save background color
            textColor, // Save text color
            viewCount: 0 // Initialize view count to 0
        });

        const savedPage = await newPage.save();
        res.status(201).json(savedPage); 
    } catch (error) {
        console.error("Error creating page:", error);
        res.status(500).json({ message: 'Error creating page', error });
    }
};

// Update a specific page by ID with image upload
exports.updatePage = async (req, res) => {
    const { id } = req.params;
    const { title, description, links, backgroundColor, textColor } = req.body; // Include new fields
    const profileImage = req.file ? req.file.filename : null; // Use filename instead of path

    try {
        // Prepare update object
        const updateData = { title, description, links, backgroundColor, textColor };
        
        // Only update profileImage if a new one has been uploaded
        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        const updatedPage = await Page.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedPage) return res.status(404).json({ message: 'Page not found' });
        
        res.json(updatedPage); // Respond with updated page data
    } catch (error) {
        console.error("Error updating page:", error);
        res.status(500).json({ message: 'Error updating page', error });
    }
};

// Get all pages for a user
exports.getPages = async (req, res) => {
    try {
        const pages = await Page.find({ userId: req.user.id });
        res.json(pages); // Respond with the found pages
    } catch (error) {
        console.error("Error fetching pages:", error);
        res.status(500).json({ message: 'Error fetching pages', error });
    }
};

// Get a specific page by ID (public access)
exports.getPageById = async (req, res) => {
    const { id } = req.params;

    try {
        const page = await Page.findById(id); // Fetch the page by ID
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page); // Respond with the page data
    } catch (error) {
        console.error("Error fetching page:", error);
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

// Delete a page by ID
exports.deletePage = async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await Page.findByIdAndDelete(id); 
        if (!result) {
            return res.status(404).json({ message: 'Page not found.' }); 
        }
        res.status(200).json({ message: 'Page deleted successfully.' });
    } catch (error) {
        console.error("Error deleting page:", error);
        res.status(500).json({ message: 'Error deleting page', error: error.message }); 
    }
};

// Increment view count for a specific page by ID
exports.incrementViewCount = async (req, res) => {
    const { id } = req.params;
    
    try {
        const updatedPage = await Page.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
        
        if (!updatedPage) return res.status(404).json({ message: 'Page not found' });
        
        res.json(updatedPage); // Respond with updated view count or other relevant data
    } catch (error) {
        console.error("Error incrementing view count:", error);
        res.status(500).json({ message: 'Error incrementing view count', error });
    }
};
