const http = require('http');
const app = require('./app');
const { connect } = require('./config/db');
const { Server } = require('socket.io');
const decisionTree = require('./services/decisionTree');
const proposalService = require('./services/proposalService');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function start() {
  await connect();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('start', () => {
      decisionTree.startSession(socket.id);
      const first = decisionTree.process(socket.id, 'iniciar');
      socket.emit('bot_message', first.reply);
    });

    socket.on('user_message', async (msg) => {
      const result = decisionTree.process(socket.id, msg);
      socket.emit('bot_message', result.reply);

      const session = decisionTree.getSession(socket.id);
      if (session?.completed) {
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
          socket.emit('bot_message', 'Proposta salva com sucesso!');
          io.emit('new_proposal', saved);
          decisionTree.resetSession(socket.id);
        } catch (err) {
          console.error(err);
          socket.emit('bot_message', 'Erro ao salvar proposta. Tente novamente mais tarde.');
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
