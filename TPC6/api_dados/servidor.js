const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configuração da ligação ao MongoDB (usando o nome do teu container externo)
const mongoURL = process.env.MONGO_URL || 'mongodb://mongoEW:27017/cinema';

mongoose.connect(mongoURL)
  .then(() => console.log('API conectada ao MongoDB em: ' + mongoURL))
  .catch(err => console.error('Erro de conexão ao MongoDB:', err));

// Modelos Genéricos (strict: false permite ler qualquer campo do JSON original)
const Movie = mongoose.model('Movie', new mongoose.Schema({}, {strict:false}), 'filmes');
const Actor = mongoose.model('Actor', new mongoose.Schema({}, {strict:false}), 'atores');
const Genre = mongoose.model('Genre', new mongoose.Schema({}, {strict:false}), 'generos');

// --- ROTAS DE FILMES ---

// GET /filmes - Tabela com id, título, ano, nº atores e nº géneros
app.get('/filmes', async (req, res) => {
    try {
        const filmes = await Movie.find().sort({title: 1});
        const resultado = filmes.map(f => ({
            _id: f._id,
            title: f.title,
            year: f.year,
            numAtores: f.cast ? f.cast.length : 0,
            numGeneros: f.genres ? f.genres.length : 0
        }));
        res.json(resultado);
    } catch (e) { res.status(500).json({erro: e.message}) }
});

// GET /filmes/:id - Toda a informação de um filme
app.get('/filmes/:id', async (req, res) => {
    try {
        const filme = await Movie.findById(req.params.id);
        res.json(filme);
    } catch (e) { res.status(500).json({erro: e.message}) }
});

// --- ROTAS DE ATORES ---

// GET /atores - Tabela com id, nome e número de filmes
app.get('/atores', async (req, res) => {
    try {
        const atores = await Actor.find().sort({nome: 1});
        const filmes = await Movie.find({}, 'cast'); // Só pedimos o cast para ser mais rápido
        
        const resultado = atores.map(a => {
            const nFilmes = filmes.filter(f => f.cast && f.cast.includes(a.nome)).length;
            return { id: a.id, nome: a.nome, numFilmes: nFilmes };
        });
        res.json(resultado);
    } catch (e) { res.status(500).json({erro: e.message}) }
});

// GET /atores/:id - Toda a informação de um ator (usamos o nome como ID)
app.get('/atores/:id', async (req, res) => {
    try {
        // No teu dataset, o campo 'nome' na coleção atores é o identificador
        const ator = await Actor.findOne({ nome: req.params.id });
        // Procurar todos os filmes onde este ator aparece no cast
        const filmesDoAtor = await Movie.find({ cast: req.params.id }, 'title _id year');
        
        res.json({ info: ator, filmes: filmesDoAtor });
    } catch (e) { res.status(500).json({erro: e.message}) }
});

// --- ROTAS DE GÉNEROS ---

// GET /generos - Tabela com id, designação e número de filmes
app.get('/generos', async (req, res) => {
    try {
        const generos = await Genre.find().sort({designacao: 1});
        const filmes = await Movie.find({}, 'genres');
        
        const resultado = generos.map(g => {
            const nFilmes = filmes.filter(f => f.genres && f.genres.includes(g.designacao)).length;
            return { id: g.id, designacao: g.designacao, numFilmes: nFilmes };
        });
        res.json(resultado);
    } catch (e) { res.status(500).json({erro: e.message}) }
});

// Iniciar servidor
app.listen(7779, () => console.log('Servidor de Dados (API) a correr na porta 7779'));