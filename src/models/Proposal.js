const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: String,
  description: String,
  problem: String,
  departments: String,
  submitter: {
    name: String,
    matricula: String,
    cpf: String,
    phone: String
  },
  participants: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);
