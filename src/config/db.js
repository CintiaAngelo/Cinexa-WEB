const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/innovation');
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err);
    process.exit(1);
  }
}

module.exports = { connect };
