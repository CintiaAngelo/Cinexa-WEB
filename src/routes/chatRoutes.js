const express = require('express');
const router = express.Router();
const decisionTree = require('../services/decisionTree');
const proposalService = require('../services/proposalService');

// Endpoint para processar mensagem do chat via REST
router.post('/message', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) return res.status(400).json({ error: 'sessionId e message são obrigatórios' });

  const r = decisionTree.process(sessionId, message);
  const session = decisionTree.getSession(sessionId);

  // Se fluxo finalizado, salva no MongoDB
  if (session && session.completed) {
    const payload = {
      title: session.data.title,
      description: session.data.description,
      problem: session.data.problem,
      departments: session.data.departments,
      submitter: {
        name: session.data.name,
        matricula: session.data.matricula,
        cpf: session.data.cpf,
        phone: session.data.phone
      },
      participants: session.data.participants || []
    };
    try {
      const saved = await proposalService.createProposal(payload);
      decisionTree.resetSession(sessionId);
      return res.json({ reply: '✅ Proposta salva com sucesso!', saved, done: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar proposta' });
    }
  }

  res.json({ reply: r.reply, done: r.done });
});

module.exports = router;
