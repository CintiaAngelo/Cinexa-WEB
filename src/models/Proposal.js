// models/Proposal.js
const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    department: String
  },
  title: String,
  description: String,
  problem: String,
  departments: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', ProposalSchema);
