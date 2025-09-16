const decisionTree = require('../services/decisionTree');
const proposalService = require('../services/proposalService');

/**
 * handleMessage: endpoint REST (optional)
 * Expected body: { sessionId, message }
 */
async function handleMessage(req, res) {
  const { sessionId, message } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  const r = decisionTree.process(sessionId, message);
  // if user completed flow and state says completed, save
  const session = decisionTree.getSession(sessionId);
  if (session && session.completed) {
    // build payload for saving
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
      // reset session after save
      decisionTree.resetSession(sessionId);
      return res.json({ reply: 'Proposta salva com sucesso!', saved, done: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao salvar proposta' });
    }
  }
  return res.json({ reply: r.reply, done: r.done });
}

module.exports = { handleMessage };
