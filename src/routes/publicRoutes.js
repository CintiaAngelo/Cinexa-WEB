const express = require('express');
const router = express.Router();
const User = require('../models/User');
const proposalService = require('../services/proposalService');

router.get('/users', async (req, res) => {
  try {
    const q = req.query.q || '';
    const filter = q ? { $or: [{ matricula: { $regex: q } }, { name: { $regex: q, $options: 'i' } }] } : {};
    const users = await User.find(filter).limit(100).lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

router.get('/proposals', async (req, res) => {
  try {
    const list = await proposalService.listProposals(200);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar propostas' });
  }
});


module.exports = router;
