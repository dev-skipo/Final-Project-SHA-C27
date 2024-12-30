const express = require('express');
const { createPage, getPages, getPageById, updatePage, deletePage, incrementViewCount } = require('../controllers/pageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, createPage); // Create a new page
router.get('/', authMiddleware, getPages); 
router.get('/:id', getPageById); 
router.put('/:id', updatePage); 
router.delete('/:id', authMiddleware, deletePage); 
router.post('/:id/view', incrementViewCount); // Add this line for incrementing view count

module.exports = router;