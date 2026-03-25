const express = require('express')
const router = express.Router()
const axios = require('axios')

// GET / — página principal com tabela de todos os registos
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${req.apiUrl}/repairs`)
    res.render('index', { reparacoes: response.data })
  } catch (err) {
    res.status(500).send('Erro ao obter dados da API: ' + err.message)
  }
})

// GET /:marca — página da marca
router.get('/:param', async (req, res) => {
  const param = req.params.param

  // Se parecer um ObjectId MongoDB (24 caracteres hexadecimais) → página do registo
  if (/^[a-fA-F0-9]{24}$/.test(param)) {
    try {
      const response = await axios.get(`${req.apiUrl}/repairs/${param}`)
      res.render('registo', { reparacao: response.data })
    } catch (err) {
      res.status(404).send('Registo não encontrado.')
    }
  } else {
    // Caso contrário → página da marca
    try {
      const response = await axios.get(`${req.apiUrl}/repairs?marca=${encodeURIComponent(param)}`)
      const reparacoes = response.data
      // Modelos únicos desta marca
      const modelos = [...new Set(reparacoes.map(r => r.viatura.modelo))].sort()
      res.render('marca', { marca: param, modelos, reparacoes })
    } catch (err) {
      res.status(500).send('Erro ao obter dados da API: ' + err.message)
    }
  }
})

module.exports = router