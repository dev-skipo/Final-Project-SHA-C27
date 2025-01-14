// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Basic email validation
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page', // Reference to the Page model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
