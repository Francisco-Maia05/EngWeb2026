const mongoose = require('mongoose')

const intervencaoSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  descricao: String
}, { _id: false })

const viaturaSchema = new mongoose.Schema({
  marca: String,
  modelo: String,
  matricula: String
}, { _id: false })

const reparacaoSchema = new mongoose.Schema({
  nome: String,
  nif: Number,
  data: String,
  viatura: viaturaSchema,
  nr_intervencoes: Number,
  intervencoes: [intervencaoSchema]
})

module.exports = mongoose.model('Repair', reparacaoSchema, 'repairs')