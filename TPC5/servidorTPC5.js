const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// 2.a) Listar Filmes
app.get(['/', '/filmes'], (req, res) => {
    axios.get('http://localhost:3000/filmes')
        .then(resp => res.render('index', { lista: resp.data }))
        .catch(err => res.render('error', { error: err.message }));
});

// 2.b) Detalhe do Filme (Filtrando por Título)
app.get('/filmes/:id', (req, res) => {
    const tituloFilme = req.params.id;
    axios.get('http://localhost:3000/filmes')
        .then(resp => {
            // Procuramos o filme que tem o título igual ao parâmetro da URL
            const filme = resp.data.find(f => f.title === tituloFilme);
            if (filme) {
                res.render('filme', { filme: filme });
            } else {
                res.status(404).render('error', { error: "Filme não encontrado: " + tituloFilme });
            }
        })
        .catch(err => res.render('error', { error: err.message }));
});

// 2.c e 2.d) Atores
app.get('/atores', (req, res) => {
    axios.get('http://localhost:3000/filmes')
        .then(resp => {
            let atores = {};
            resp.data.forEach(f => {
                f.cast.forEach(a => {
                    if(!atores[a]) atores[a] = 0;
                    atores[a]++;
                });
            });
            let lista = Object.keys(atores).map(n => ({nome: n, nFilmes: atores[n]}));
            res.render('atores', { lista: lista.sort((a,b) => a.nome.localeCompare(b.nome)) });
        })
        .catch(err => res.render('error', { error: err.message }));
});

app.get('/atores/:id', (req, res) => {
    const nomeAtor = req.params.id;
    axios.get('http://localhost:3000/filmes')
        .then(resp => {
            let filmes = resp.data.filter(f => f.cast.includes(nomeAtor));
            res.render('ator', { nome: nomeAtor, filmes: filmes });
        })
        .catch(err => res.render('error', { error: err.message }));
});

// 2.e) Extra: Géneros
app.get('/generos', (req, res) => {
    axios.get('http://localhost:3000/filmes')
        .then(resp => {
            let gens = {};
            resp.data.forEach(f => {
                f.genres.forEach(g => {
                    if(!gens[g]) gens[g] = 0;
                    gens[g]++;
                });
            });
            let lista = Object.keys(gens).map(n => ({nome: n, nFilmes: gens[n]}));
            res.render('generos', { lista: lista });
        })
        .catch(err => res.render('error', { error: err.message }));
});

app.get('/generos/:id', (req, res) => {
    const gen = req.params.id;
    axios.get('http://localhost:3000/filmes')
        .then(resp => {
            let filmes = resp.data.filter(f => f.genres.includes(gen));
            res.render('genero', { genero: gen, filmes: filmes });
        })
        .catch(err => res.render('error', { error: err.message }));
});

app.listen(25002, () => console.log("Servidor ativo na porta 25002"));