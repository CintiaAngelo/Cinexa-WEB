// src/controllers/chatController.js
const decisionTree = require('../services/decisionTree');
const proposalService = require('../services/proposalService');

async function processMessage(req, res) {
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId e message são obrigatórios' });
  }

  try {
    const result = decisionTree.process(sessionId, message);

    // Se o fluxo terminou → salva a proposta no banco
    if (result.done) {
      const session = decisionTree.getSession(sessionId);

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

          return res.json({
            reply: "Sua proposta foi salva com sucesso!",
            saved
          });
        } catch (err) {
          console.error("Erro ao salvar proposta:", err);
          return res.json({ reply: "⚠️ Erro ao salvar proposta. Tente novamente." });
        }
      }
    }

    // Resposta normal do bot
    return res.json({ reply: result.reply });

  } catch (err) {
    console.error("Erro no processMessage:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { processMessage };
