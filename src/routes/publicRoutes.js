const express = require('express');
const router = express.Router();
const { getNewsletter, setNewsletter } = require('../controllers/newsletterController');
const proposalService = require('../services/proposalService');

// --- Newsletter ---
// GET última newsletter
router.get('/newsletter', async (req, res) => {
  try {
    await getNewsletter(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar newsletter' });
  }
});

// POST atualizar newsletter
router.post('/newsletter', async (req, res) => {
  try {
    await setNewsletter(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar newsletter' });
  }
});

// --- Propostas ---
// GET todas as propostas (limite opcional ?limit=50)
router.get('/proposals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const proposals = await proposalService.listProposals(limit);
    res.json(proposals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar propostas' });
  }
});

module.exports = router;
