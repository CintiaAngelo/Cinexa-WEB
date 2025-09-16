const steps = [
  "Você deseja adicionar uma nova ideia de inovação? (sim/não)",
  "Qual é o seu nome completo?",
  "Informe seu número de matrícula (apenas números):",
  "Informe seu CPF (apenas números):",
  "Informe seu telefone corporativo (opcional - digite 'pular' para pular):",
  "Deseja incluir outros participantes? Se sim, informe as matrículas separadas por vírgula ou digite 'não':",
  "Agora, informe o título da proposta:",
  "Descreva sua ideia em detalhes:",
  "Qual problema essa ideia resolve?",
  "Quais departamentos serão impactados?",
  "Confirme: digite 'confirmar' para salvar, 'editar' para recomeçar, ou 'cancelar' para cancelar."
];

function startSession(sessionId) {
  sessions.set(sessionId, { step: -1, data: {} }); // start with step -1
  return steps[0];
}

function process(sessionId, message) {
  const sess = getSession(sessionId);
  const s = sess;

  const replyAndContinue = (reply, done=false) => ({ reply, done });
  const text = (message || '').trim().toLowerCase();

  // handle cancel command
  if (text === 'cancelar') {
    resetSession(sessionId);
    return replyAndContinue('Fluxo cancelado. Se quiser iniciar novamente, digite "iniciar".', true);
  }

  switch (s.step) {
    case -1:
  if (text === 'sim' || text === 's' || text === 'iniciar') {
    s.step = 1; // próximo passo: perguntar nome
    sessions.set(sessionId, s);
    return replyAndContinue(steps[1]);
  } else {
    resetSession(sessionId);
    return replyAndContinue('Ok! Você pode digitar "iniciar" quando quiser adicionar uma ideia.', true);
  }


    case 1:
      s.data.name = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 2:
      s.data.matricula = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 3:
      s.data.cpf = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 4:
      s.data.phone = (text === 'pular' || text === '') ? null : message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 5:
      s.data.participants = (text === 'não' || text === 'nao' || text === 'n') ? [] : message.split(',').map(t => t.trim()).filter(Boolean);
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 6:
      s.data.title = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 7:
      s.data.description = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 8:
      s.data.problem = message;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);

    case 9:
      s.data.departments = message;
      s.step++;
      sessions.set(sessionId, s);
      const summary = `Resumo: \n
      Nome: ${s.data.name} \n
      Matrícula: ${s.data.matricula}\n
      CPF: ${s.data.cpf}\n
      Telefone: ${s.data.phone || '—'}\n
      Participantes: ${(s.data.participants || []).join(', ') || '—'}\n\n
      Título: ${s.data.title}\n
      Descrição: ${s.data.description}\n
      Problema: ${s.data.problem}\n
      Departamentos: ${s.data.departments}\n
      Para salvar digite 'confirmar'.`;
      return replyAndContinue(summary);

    case 10:
      if (text === 'confirmar') {
        s.completed = true;
        sessions.set(sessionId, s);
        return replyAndContinue('Pronto — vou salvar sua proposta. Aguarde...', true);
      } else if (text === 'editar') {
        resetSession(sessionId);
        return replyAndContinue('Iniciando edição — digite seu nome completo:', false);
      } else {
        return replyAndContinue("Comando inválido. Digite 'confirmar' para salvar, 'editar' para recomeçar ou 'cancelar'.");
      }

    default:
      resetSession(sessionId);
      return replyAndContinue('Fluxo reiniciado. Digite "iniciar" para começar.');
  }
}

const sessions = new Map(); // sessionId => { step, data }

function getSession(sessionId) {
  if (!sessions.has(sessionId)) startSession(sessionId);
  return sessions.get(sessionId);
}

function resetSession(sessionId) {
  sessions.set(sessionId, { step: -1, data: {} });
}

module.exports = { startSession, process, getSession, resetSession, sessions };

