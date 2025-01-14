// controllers/subscriptionController.js
const Subscription = require('../models/Subscription');

exports.createSubscription = async (req, res) => {
    const { email, pageId } = req.body;

    console.log("Received subscription request:");
    console.log("Email:", email);
    console.log("Page ID:", pageId);

    try {
        // Check if the email already exists
        const existingSubscription = await Subscription.findOne({ email });
        if (existingSubscription) {
            console.log("Email already subscribed:", email);
            return res.status(400).json({ message: 'Email already subscribed.' });
        }

        // Create a new subscription
        const newSubscription = new Subscription({ email, pageId });
        await newSubscription.save();

        res.status(201).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// New function to get subscriptions by page ID
exports.getSubscriptionsByPageId = async (req, res) => {
    const { pageId } = req.params;

    try {
        const subscriptions = await Subscription.find({ pageId });
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};