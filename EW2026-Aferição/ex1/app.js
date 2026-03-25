const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = 16025
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autoRepair'

// Middleware
app.use(express.json())

// Rotas
const repairsRouter = require('./routes/Repairs')
app.use('/repairs', repairsRouter)

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'API de Reparações de Automóveis - EW2026' })
})

// Ligação ao MongoDB e arranque do servidor
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Ligado ao MongoDB:', MONGO_URI)
    app.listen(PORT, () => {
      console.log(`🚀 API a correr em http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Erro ao ligar ao MongoDB:', err.message)
    process.exit(1)
  })
