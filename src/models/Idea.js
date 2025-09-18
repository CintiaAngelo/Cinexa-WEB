const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: String,
  description: String,
  problem: String,
  departments: String,
  date: { type: Date, default: Date.now },
  submitter: {
    name: String,
    matricula: String,
    cpf: String,
    phone: String
  },
  participants: [String]
});

module.exports = mongoose.model('Idea', ideaSchema);
