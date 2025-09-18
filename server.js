// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import services/controllers
const decisionTree = require('./src/services/decisionTree');
const proposalService = require('./src/services/proposalService');
const { getNewsletter } = require('./controllers/newsletterController');
const { createIdea } = require('./controllers/ideaController');
const proposalRoutes = require('./routes/proposals');
app.use('/api/proposals', proposalRoutes);



// --- Configurações do app ---
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Conexão MongoDB ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/innovation')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// --- Rotas REST ---
// Newsletter
app.get('/api/newsletter', async (req, res) => {
  try {
    const newsletter = await getNewsletter(req, res);
    // getNewsletter já retorna JSON
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar newsletter' });
  }
});

// Criar ideia
app.post('/api/idea', async (req, res) => {
  try {
    await createIdea(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar ideia' });
  }
});

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Sempre que o usuário envia uma mensagem
  socket.on('user_message', (msg) => {
    const result = decisionTree.process(socket.id, msg);
    socket.emit('bot_message', result.reply);

    // Se a sessão estiver completa e precisa salvar
    if (result.done) {
      const session = decisionTree.getSession(socket.id);
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

        proposalService.createProposal(payload)
          .then(saved => {
            socket.emit('bot_message', 'Sua proposta foi salva com sucesso!');
            io.emit('new_proposal', saved); // Notifica todos os clientes conectados
            decisionTree.resetSession(socket.id); // Reseta a sessão após salvar
          })
          .catch(err => {
            console.error(err);
            socket.emit('bot_message', 'Erro ao salvar proposta.');
          });
      }
    }
  });

  // Opcional: quando o cliente desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    decisionTree.resetSession(socket.id);
  });
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
