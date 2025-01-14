// routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// POST route for subscribing
router.post('/', subscriptionController.createSubscription); // Note: Changed to '/' to match '/api/subscriptions'

// GET route for fetching subscriptions by page ID
router.get('/:pageId', subscriptionController.getSubscriptionsByPageId); // New route

module.exports = router;
