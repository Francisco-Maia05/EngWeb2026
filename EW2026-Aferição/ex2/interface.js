const express = require('express')
const app = express()

const PORT = 16026
const API_URL = process.env.API_URL || 'http://localhost:16025'

app.set('view engine', 'pug')
app.set('views', './views')

// Passar a API_URL às rotas
app.use((req, res, next) => {
  req.apiUrl = API_URL
  next()
})

const repairsRouter = require('./routes/repairs')
app.use('/', repairsRouter)

app.listen(PORT, () => {
  console.log(`🚀 Interface a correr em http://localhost:${PORT}`)
})