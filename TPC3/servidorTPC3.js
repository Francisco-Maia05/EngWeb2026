const http = require('http')
const axios = require('axios')

// Função auxiliar para o template HTML
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
                <header class="w3-container w3-indigo">
                    <h1>${titulo}</h1>
                </header>
                <div class="w3-container w3-margin-top">
                    ${conteudo}
                </div>
                <footer class="w3-container w3-indigo w3-margin-top">
                    <a href="/" class="w3-button w3-light-grey w3-margin-bottom">Voltar ao Menu</a>
                </footer>
            </div>
        </body>
    </html>`
}

http.createServer(async function (req, res) {
    const d = new Date().toISOString().substring(0, 16)
    console.log(`${req.method} ${req.url} ${d}`)

    switch(req.method) {
        case "GET":
            // --- MENU PRINCIPAL ---
            if (req.url == "/") {
                let menu = `
                    <div class="w3-container">
                        <ul class="w3-ul w3-border w3-hoverable">
                            <li><a href="/alunos" style="display:block;text-decoration:none">Listagem de Alunos</a></li>
                            <li><a href="/cursos" style="display:block;text-decoration:none">Listagem de Cursos</a></li>
                            <li><a href="/instrumentos" style="display:block;text-decoration:none">Listagem de Instrumentos</a></li>
                        </ul>
                    </div>`
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(geraPagina("Escola de Música", menu))
            } 
            
            // --- LISTA DE ALUNOS ---
            else if (req.url == "/alunos") {
                try {
                    const response = await axios.get('http://localhost:3000/alunos')
                    const alunos = response.data
                    let linhas = alunos.map(a => `
                        <tr>
                            <td>${a.id}</td>
                            <td>${a.nome}</td>
                            <td>${a.instrumento}</td>
                            <td>${a.curso}</td>
                        </tr>`).join("")

                    let tabela = `
                        <table class="w3-table w3-striped w3-bordered">
                            <tr class="w3-indigo">
                                <th>ID</th><th>Nome</th><th>Instrumento</th><th>Curso</th>
                            </tr>
                            ${linhas}
                        </table>`
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(geraPagina("Listagem de Alunos", tabela))
                } catch(err) {
                    res.writeHead(500)
                    res.end("Erro ao carregar alunos.")
                }
            }

            // --- LISTA DE CURSOS ---
            else if (req.url == "/cursos") {
                try {
                    // Nota: Assume-se que o endpoint /cursos existe no json-server
                    const response = await axios.get('http://localhost:3000/cursos')
                    const cursos = response.data
                    let linhas = cursos.map(c => `
                        <tr>
                            <td>${c.id}</td>
                            <td>${c.designacao}</td>
                            <td>${c.duracao} anos</td>
                        </tr>`).join("")

                    let tabela = `
                        <table class="w3-table w3-striped w3-bordered">
                            <tr class="w3-indigo">
                                <th>ID</th><th>Designação</th><th>Duração</th>
                            </tr>
                            ${linhas}
                        </table>`
                    res.end(geraPagina("Listagem de Cursos", tabela))
                } catch(err) {
                    res.end("Erro ao carregar cursos. Verifique se o endpoint /cursos existe.")
                }
            }

            // --- LISTA DE INSTRUMENTOS ---
            else if (req.url == "/instrumentos") {
                try {
                    const response = await axios.get('http://localhost:3000/instrumentos')
                    const instrumentos = response.data
                    let linhas = instrumentos.map(i => `
                        <tr>
                            <td>${i.id}</td>
                            <td>${i["#text"]}</td>
                        </tr>`).join("")

                    let tabela = `
                        <table class="w3-table w3-striped w3-bordered">
                            <tr class="w3-indigo">
                                <th>ID</th><th>Nome</th>
                            </tr>
                            ${linhas}
                        </table>`
                    res.end(geraPagina("Listagem de Instrumentos", tabela))
                } catch(err) {
                    res.end("Erro ao carregar instrumentos.")
                }
            }
            break

        default:
            res.writeHead(405)
            res.end("Método não permitido.")
            break
    }
}).listen(25001)

console.log("Servidor da Escola de Música à escuta na porta 25001...")