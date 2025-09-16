const express = require('express');
const router = express.Router();
const User = require('../models/User');
const proposalService = require('../services/proposalService');

// Lista usuários (para seleção por matrícula)
router.get('/users', async (req, res) => {
  const q = req.query.q || '';
  const filter = q ? { $or: [{ matricula: { $regex: q } }, { name: { $regex: q, $options: 'i' } }] } : {};
  const users = await User.find(filter).limit(100).lean();
  res.json(users);
});

// lista proposals
router.get('/proposals', async (req, res) => {
  const list = await proposalService.listProposals(200);
  res.json(list);
});

module.exports = router;
