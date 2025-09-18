// routes/proposals.js
const express = require('express');
const router = express.Router();
const { createIdea } = require('../controllers/ideaController');
const { getAllIdeas } = require('../controllers/ideaController');

// Criar uma nova proposta
router.post('/', async (req, res) => {
  try {
    await createIdea(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar proposta' });
  }
});

// Listar todas as propostas
router.get('/', async (req, res) => {
  try {
    const ideas = await getAllIdeas(); // função no seu controller que retorna todas as ideias do Mongo
    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar propostas' });
  }
});

module.exports = router;
