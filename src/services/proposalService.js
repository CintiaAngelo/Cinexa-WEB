const Proposal = require('../models/proposal');

async function createProposal(payload) {
  const p = new Proposal(payload);
  await p.save();
  return p;
}

async function listProposals(limit = 50) {
  return Proposal.find().sort({ createdAt: -1 }).limit(limit).lean();
}

module.exports = { createProposal, listProposals };
