const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serviços
const decisionTree = require('./src/services/decisionTree');
const proposalService = require('./src/services/proposalService');
const { connect } = require('./src/config/db');

// Rotas API (opcional)
app.use('/api', require('./src/routes/publicRoutes')); // newsletter, etc.
app.use('/api/chat', require('./src/routes/chatRoutes')); // caso queira REST

// Conecta ao MongoDB
connect();

// ---- SOCKET.IO ----
io.on('connection', socket => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Inicia sessão automaticamente
  const sessionId = socket.id;
  const firstMessage = decisionTree.startSession(sessionId);
  socket.emit('bot_message', firstMessage);

  // Recebe mensagem do usuário
  socket.on('user_message', async message => {
    const r = decisionTree.process(sessionId, message);
    socket.emit('bot_message', r.reply);

    const session = decisionTree.getSession(sessionId);

    // Se finalizou o fluxo
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
        socket.emit('bot_message', '✅ Sua proposta foi salva com sucesso!');
        io.emit('new_proposal', saved); // notifica todos os clientes
        decisionTree.resetSession(sessionId);
      } catch (err) {
        console.error(err);
        socket.emit('bot_message', '❌ Ocorreu um erro ao salvar sua proposta.');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
    decisionTree.resetSession(socket.id);
  });
});

// ---- SERVIDOR ----
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
