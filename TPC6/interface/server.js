const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Configurações do Express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// URL da API de Dados (Ajustada para o Docker Compose ou Localhost)
const API_URL = process.env.API_URL || "http://localhost:7779";

// GET /filmes
app.get(['/', '/filmes'], (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes`)
        .then(response => {
            res.render('index', { filmes: response.data, date: d });
        })
        .catch(err => res.render('error', { error: err, date: d }));
});

// GET /filmes/:id
app.get('/filmes/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes/${req.params.id}`)
        .then(response => {
            res.render('filme', { filme: response.data, date: d });
        })
        .catch(err => res.render('error', { error: err, date: d }));
});

// GET /atores
app.get('/atores', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores`)
        .then(response => {
            res.render('atores', { atores: response.data, date: d });
        })
        .catch(err => res.render('error', { error: err, date: d }));
});

// GET /atores/:id
app.get('/atores/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores/${req.params.id}`)
        .then(response => {
            res.render('ator', { info: response.data.info, filmes: response.data.filmes, date: d });
        })
        .catch(err => res.render('error', { error: err, date: d }));
});

// GET /generos
app.get('/generos', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/generos`)
        .then(response => {
            res.render('generos', { generos: response.data, date: d });
        })
        .catch(err => res.render('error', { error: err, date: d }));
});

const PORT = 7780;
app.listen(PORT, () => {
    console.log(`Interface Cinema em http://localhost:${PORT}`);
});