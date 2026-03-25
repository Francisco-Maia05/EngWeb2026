const express = require('express')
const router = express.Router()
const Repair = require('../models/Repair')

// GET /repairs/matriculas — lista de matrículas (sem repetições, ordenada)
router.get('/matriculas', async (req, res) => {
  try {
    const matriculas = await Repair.distinct('viatura.matricula')
    matriculas.sort()
    res.json(matriculas)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /repairs/interv — lista de intervenções
router.get('/interv', async (req, res) => {
  try {
    const result = await Repair.aggregate([
      { $unwind: '$intervencoes' },
      {
        $group: {
          _id: '$intervencoes.codigo',
          codigo: { $first: '$intervencoes.codigo' },
          nome: { $first: '$intervencoes.nome' },
          descricao: { $first: '$intervencoes.descricao' }
        }
      },
      { $sort: { codigo: 1 } },
      { $project: { _id: 0, codigo: 1, nome: 1, descricao: 1 } }
    ])
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /repairs — lista completa, com filtros opcionais por ano e marca
router.get('/', async (req, res) => {
  try {
    const { ano, marca } = req.query
    const filter = {}

    if (ano) {
      // Filtrar por ano usando regex na string da data (formato YYYY-MM-DD)
      filter.data = { $regex: `^${ano}-` }
    }
    if (marca) {
      filter['viatura.marca'] = { $regex: new RegExp(`^${marca}$`, 'i') }
    }

    const repairs = await Repair.find(filter)
    res.json(repairs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /repairs/:id — registo por id
router.get('/:id', async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id)
    if (!repair) return res.status(404).json({ error: 'Registo não encontrado' })
    res.json(repair)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /repairs — acrescentar novo registo
router.post('/', async (req, res) => {
  try {
    const repair = new Repair(req.body)
    const saved = await repair.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /repairs/:id — eliminar registo por id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Repair.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Registo não encontrado' })
    res.json({ message: 'Registo eliminado com sucesso', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router