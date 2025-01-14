const express = require('express');
const { 
    createPage, 
    getPages, 
    getPageById, 
    updatePage, 
    deletePage, 
    incrementViewCount 
} = require('../controllers/pageController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path'); // Import path

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

const router = express.Router();

// Route to create a new page with image upload
router.post('/', authMiddleware, upload.single('profilePicture'), createPage); 

// Route to get all pages for the authenticated user
router.get('/', authMiddleware, getPages); 

// Route to get a specific page by ID (public access)
router.get('/:id', getPageById); 

// Route to update a specific page by ID with image upload
router.put('/:id', authMiddleware, upload.single('profilePicture'), updatePage); 

// Route to delete a page by ID
router.delete('/:id', authMiddleware, deletePage); 

// Route to increment view count for a specific page by ID
router.post('/:id/view', incrementViewCount); 


module.exports = router;
