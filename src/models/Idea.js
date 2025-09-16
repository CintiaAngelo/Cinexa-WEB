const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    idea: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
