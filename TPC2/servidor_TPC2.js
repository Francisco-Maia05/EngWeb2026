const http = require('http')
const axios = require('axios')

function geraPagina(titulo, conteudo) {
    return `
    <html>
        <head>
            <title>${titulo}</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1>${titulo}</h1>
                </header>
                <div class="w3-container">
                    ${conteudo}
                </div>
                <footer class="w3-container w3-teal">
                    <a href="/" class="w3-button w3-light-grey w3-margin-bottom">Voltar ao Menu</a>
                </footer>
            </div>
        </body>
    </html>`
}

http.createServer(async function (req, res) {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    switch(req.method) {
        case "GET":
            // --- MENU PRINCIPAL ---
            if (req.url == "/") {
                let html = `
                    <ul class="w3-ul w3-hoverable">
                        <li><a href="/reparacoes">Listagem de Reparações</a></li>
                        <li><a href="/intervencoes">Tipos de Intervenção</a></li>
                        <li><a href="/viaturas">Listagem de Viaturas</a></li>
                    </ul>`
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(geraPagina("Oficina Automóvel", html))
            } 
            
            // --- LISTA DE REPARAÇÕES ---
            else if (req.url == "/reparacoes") {
                try {
                    const response = await axios.get('http://localhost:3000/reparacoes')
                    let reps = response.data
                    let linhas = reps.map(r => `
                        <tr>
                            <td>${r.data}</td>
                            <td>${r.nome}</td>
                            <td>${r.viatura.marca} ${r.viatura.modelo}</td>
                            <td>${r.nr_intervencoes}</td>
                        </tr>`).join("")

                    let tabela = `
                        <table class="w3-table w3-striped w3-bordered">
                            <tr class="w3-teal">
                                <th>Data</th><th>Cliente</th><th>Viatura</th><th>Intervenções</th>
                            </tr>
                            ${linhas}
                        </table>`
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(geraPagina("Lista de Reparações", tabela))
                } catch(err) {
                    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end("<p>Erro ao obter reparações: " + err + "</p>")
                }
            }

            // --- LISTa DE INTERVENÇÕES ---
            else if (req.url == "/intervencoes") {
                try {
                    const response = await axios.get('http://localhost:3000/reparacoes')
                    let reps = response.data
                    let intervencoes = {}

                    reps.forEach(r => {
                        r.intervencoes.forEach(i => {
                            if(!intervencoes[i.codigo]) {
                                intervencoes[i.codigo] = { nome: i.nome, freq: 0 }
                            }
                            intervencoes[i.codigo].freq++
                        })
                    })

                    let linhas = Object.keys(intervencoes).sort().map(cod => `
                        <tr>
                            <td>${cod}</td>
                            <td>${intervencoes[cod].nome}</td>
                            <td>${intervencoes[cod].freq}</td>
                        </tr>`).join("")

                    let tabela = `<table class="w3-table w3-striped w3-bordered">
                        <tr class="w3-teal"><th>Código</th><th>Nome</th><th>Vezes Realizada:</th></tr>
                        ${linhas}
                    </table>`
                    res.end(geraPagina("Tipos de Intervenção", tabela))
                } catch(err) { /* erro */ }
            }

            // --- LISTA DE VIATURAS ---
            else if (req.url == "/viaturas") {
                try {
                    const response = await axios.get('http://localhost:3000/reparacoes')
                    let viaturas = {}

                    response.data.forEach(r => {
                        let vKey = `${r.viatura.marca} ${r.viatura.modelo}`
                        viaturas[vKey] = (viaturas[vKey] || 0) + 1
                    })

                    let linhas = Object.keys(viaturas).sort().map(v => `
                        <tr><td>${v}</td><td>${viaturas[v]}</td></tr>`).join("")

                    let tabela = `<table class="w3-table w3-striped w3-bordered">
                        <tr class="w3-teal"><th>Marca/Modelo</th><th>Nº Reparações</th></tr>
                        ${linhas}
                    </table>`
                    res.end(geraPagina("Histórico de Viaturas", tabela))
                } catch(err) { /* erro */ }
            }
            break

        default:
            res.writeHead(405)
            res.end("Método não suportado.")
            break
    }
}).listen(25001)

console.log("Servidor à escuta na porta 25001...")
