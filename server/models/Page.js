const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    url: { type: String, required: true },
    linkTitle: { type: String, required: true }
});

const pageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    links: [{ url: String, linkTitle: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    viewCount: { type: Number, default: 0 }, // New field for tracking views
    profileImage: { type: String },
    backgroundColor: { type: String, default: '#ffffff' }, // Default background color
    textColor: { type: String, default: '#000000' } // Default text color
}, { timestamps: true });



const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
