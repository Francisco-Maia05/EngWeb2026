var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');
var templates = require('./templates.js')
var static = require('./static.js')

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });
        request.on('end', () => { callback(parse(body)); });
    } else { callback(null); }
}

var emdServer = http.createServer(async (req, res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET / ou /emd - Listagem com suporte a ordenação
                if(req.url == '/' || req.url == '/emd' || req.url.startsWith('/emd?sort=')){
                    let query = "http://localhost:3000/emd"
                    if(req.url.includes('sort=data')) query += "?_sort=dataEMD&_order=desc"
                    if(req.url.includes('sort=nome')) query += "?_sort=nome.primeiro&_order=asc"
                    
                    try {
                        const resp = await axios.get(query)
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdListPage(resp.data, d))
                    } catch(err) {
                        res.writeHead(500); res.end(templates.errorPage(err, d))
                    }
                }
                // GET /emd/registo
                else if(req.url == '/emd/registo'){
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                    res.end(templates.emdFormPage(d))
                }
                // GET /emd/stats
                else if(req.url == '/emd/stats'){
                    try {
                        const resp = await axios.get("http://localhost:3000/emd")
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdStatsPage(resp.data, d))
                    } catch(err) { res.end(templates.errorPage(err, d)) }
                }
                // GET /emd/:id (Detalhe)
                else if(/^\/emd\/[0-9a-zA-Z_]+$/.test(req.url)){
                    try {
                        const id = req.url.split("/")[2]
                        const resp = await axios.get("http://localhost:3000/emd/" + id)
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdDetailPage(resp.data, d))
                    } catch(err) { res.end(templates.errorPage(err, d)) }
                }
                // GET /emd/editar/:id
                else if(req.url.startsWith('/emd/editar/')){
                    try {
                        const id = req.url.split("/")[3]
                        const resp = await axios.get("http://localhost:3000/emd/" + id)
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(templates.emdFormEditPage(resp.data, d))
                    } catch(err) { res.end(templates.errorPage(err, d)) }
                }
                // GET /emd/apagar/:id
                else if(req.url.startsWith('/emd/apagar/')){
                    try {
                        const id = req.url.split("/")[3]
                        await axios.delete("http://localhost:3000/emd/" + id)
                        res.writeHead(302, { 'Location': '/emd' }); res.end()
                    } catch(err) { res.end(templates.errorPage(err, d)) }
                }
                break

            case "POST":
                if(req.url == '/emd'){
                    collectRequestBodyData(req, async result => {
                        if(result){
                            try {
                                await axios.post("http://localhost:3000/emd", result)
                                res.writeHead(302, { 'Location': '/emd' }); res.end()
                            } catch(err) { res.end(templates.errorPage(err, d)) }
                        }
                    })
                }
                else if(/\/emd\/[0-9a-zA-Z_]+$/.test(req.url)){
                    collectRequestBodyData(req, async result => {
                        if(result){
                            try {
                                const id = req.url.split("/")[2]
                                await axios.put("http://localhost:3000/emd/" + id, result)
                                res.writeHead(302, { 'Location': '/emd' }); res.end()
                            } catch(err) { res.end(templates.errorPage(err, d)) }
                        }
                    })
                }
                break
        }
    }
})

emdServer.listen(7777, () => { console.log("Servidor EMD à escuta na porta 7777...") }) 
