const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    url: { type: String, required: true },
    linkTitle: { type: String, required: true }
});

const pageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    links: [linkSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewCount: { type: Number, default: 0 }, // New field for tracking views
}, { timestamps: true });

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;