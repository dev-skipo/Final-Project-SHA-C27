const Page = require('../models/Page');


exports.createPage = async (req, res) => {
    const { title, description, links } = req.body; 

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }


    if (links && !Array.isArray(links)) {
        return res.status(400).json({ message: 'Links must be an array.' });
    }

    if (links) {
        for (const link of links) {
            if (!link.url || !link.linkTitle) {
                return res.status(400).json({ message: 'Each link must have a URL and a title.' });
            }
        }
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
            userId: req.user.id 
        });

        const savedPage = await newPage.save();
        res.status(201).json(savedPage); 
    } catch (error) {
        console.error("Error creating page:", error);
        res.status(500).json({ message: 'Error creating page', error });
    }
};

// Update a specific page by ID
exports.updatePage = async (req, res) => {
    const { id } = req.params;
    const { title, description, links } = req.body;

    try {
        const updatedPage = await Page.findByIdAndUpdate(id, { title, description, links }, { new: true });
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

