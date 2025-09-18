// src/services/decisionTree.js

const sessions = {}; // Armazena estado das conversas por sessionId

function startSession(sessionId) {
  sessions[sessionId] = {
    step: 0,
    data: {},
    completed: false
  };
}

function resetSession(sessionId) {
  delete sessions[sessionId];
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function process(sessionId, message) {
  if (!sessions[sessionId]) {
    startSession(sessionId);
    return { reply: "Olá! Vamos cadastrar sua ideia. Qual é o seu nome?" };
  }

  const session = sessions[sessionId];

  switch (session.step) {
    case 0:
      session.data.name = message;
      session.step++;
      return { reply: "Qual é a sua matrícula?" };

    case 1:
      session.data.matricula = message;
      session.step++;
      return { reply: "Qual é o seu CPF?" };

    case 2:
      session.data.cpf = message;
      session.step++;
      return { reply: "Qual é o seu telefone?" };

    case 3:
      session.data.phone = message;
      session.step++;
      return { reply: "De qual departamento você faz parte?" };

    case 4:
      session.data.departments = message;
      session.step++;
      return { reply: "Qual é o título da sua ideia?" };

    case 5:
      session.data.title = message;
      session.step++;
      return { reply: "Agora descreva a sua ideia." };

    case 6:
      session.data.description = message;
      session.step++;
      return { reply: "Qual problema essa ideia resolve?" };

    case 7:
      session.data.problem = message;
      session.step++;
      return { reply: "Quer adicionar participantes? (separe por vírgula ou digite 'não')" };

    case 8:
      if (message.toLowerCase() !== 'não') {
        session.data.participants = message.split(',').map(p => p.trim());
      } else {
        session.data.participants = [];
      }
      session.step++;
      session.completed = true;
      return { reply: "✅ Obrigado! Sua ideia será salva agora.", done: true };

    default:
      return { reply: "Sessão encerrada. Digite algo para começar de novo." };
  }
}

module.exports = {
  process,
  resetSession,
  getSession
};
