/**
 * decisionTree.js
 * Mecanismo simples de estado por sessão (socketId ou userId).
 * Armazena estado em memória (pode persistir em DB para produção).
 *
 * Etapas:
 * 0 nome
 * 1 matricula
 * 2 cpf
 * 3 telefone (opcional)
 * 4 incluir participantes? (se sim, pedir matrículas separadas por vírgula)
 * 5 titulo
 * 6 descricao
 * 7 problema
 * 8 departamentos
 * 9 confirmar -> salvar
 */

const sessions = new Map(); // sessionId => { step, data }

const steps = [
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
  sessions.set(sessionId, { step: 0, data: {} });
  return steps[0];
}

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    startSession(sessionId);
  }
  return sessions.get(sessionId);
}

function resetSession(sessionId) {
  sessions.set(sessionId, { step: 0, data: {} });
}

function process(sessionId, message) {
  const sess = getSession(sessionId);
  const s = sess;

  const replyAndContinue = (reply, done=false) => {
    return { reply, done };
  };

  const text = (message || '').trim();

  // handle commands
  if (text.toLowerCase() === 'cancelar') {
    resetSession(sessionId);
    return replyAndContinue('Fluxo cancelado. Se quiser iniciar novamente, digite "iniciar".', true);
  }

  // If initial trigger
  if (text.toLowerCase() === 'iniciar' || s.step === 0 && !s.data.name) {
    if (s.step === 0 && !s.data.name && text.toLowerCase() !== 'iniciar') {
      // user typed name right away
      // fallthrough
    } else {
      s.step = 0;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[0]);
    }
  }

  // State machine
  switch (s.step) {
    case 0:
      s.data.name = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 1:
      s.data.matricula = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 2:
      s.data.cpf = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 3:
      if (text.toLowerCase() === 'pular' || text === '') {
        s.data.phone = null;
      } else s.data.phone = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 4:
      if (text.toLowerCase() === 'não' || text.toLowerCase() === 'nao' || text === 'n') {
        s.data.participants = [];
      } else {
        s.data.participants = text.split(',').map(t => t.trim()).filter(Boolean);
      }
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 5:
      s.data.title = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 6:
      s.data.description = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 7:
      s.data.problem = text;
      s.step++;
      sessions.set(sessionId, s);
      return replyAndContinue(steps[s.step]);
    case 8:
      s.data.departments = text;
      s.step++;
      sessions.set(sessionId, s);
      // Build confirmation payload
      const summary = `Resumo:
Nome: ${s.data.name}
Matrícula: ${s.data.matricula}
CPF: ${s.data.cpf}
Telefone: ${s.data.phone || '—'}
Participantes: ${(s.data.participants || []).join(', ') || '—'}
Título: ${s.data.title}
Descrição: ${s.data.description}
Problema: ${s.data.problem}
Departamentos: ${s.data.departments}

Para salvar digite 'confirmar'.`;
      return replyAndContinue(summary);
    case 9:
      if (text.toLowerCase() === 'confirmar') {
        // calling save is done in controller to decouple concerns
        s.completed = true;
        sessions.set(sessionId, s);
        return replyAndContinue('Pronto — vou salvar sua proposta. Aguarde...', true);
      } else if (text.toLowerCase() === 'editar') {
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

module.exports = { startSession, process, getSession, resetSession, sessions };
