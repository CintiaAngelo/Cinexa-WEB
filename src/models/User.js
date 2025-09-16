const { Schema, model } = require('mongoose');

/**
 * User = colaborador da empresa (para seleção por matrícula)
 * Mantemos índice em matricula para pesquisa rápida
 */
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  matricula: { type: String, required: true, unique: true, index: true },
  cpf: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: null }
}, { timestamps: true });

module.exports = model('User', UserSchema);
