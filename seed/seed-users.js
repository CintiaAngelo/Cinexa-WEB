/**
 * Script simples para seed de usuários (matrículas)
 * Rode: npm run seed
 */
const { connect } = require('../src/config/db');
const User = require('../src/models/User');

async function run() {
  await connect();
  const sample = [
    { name: 'Ana Silva', matricula: '1001', cpf: '11122233344', phone: '11-99999-0001', role: 'Analista' },
    { name: 'Bruno Souza', matricula: '1002', cpf: '22233344455', phone: '11-99999-0002', role: 'Coordenador' },
    { name: 'Carlos Pereira', matricula: '1003', cpf: '33344455566', phone: '11-99999-0003', role: 'Gerente' }
  ];

  await User.deleteMany({});
  await User.insertMany(sample);
  console.log('Seed users created');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
