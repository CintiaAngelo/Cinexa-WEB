const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', ideaSchema);
