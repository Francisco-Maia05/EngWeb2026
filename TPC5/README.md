# TPC5: Sistema de Gestão de Cinema
---
## Resumo:
Este quinto trabalho prático consistiu na criação de um servidor aplicacional utilizando a framework **Express** para a gestão e visualização de um dataset de filmes. O sistema consome dados de uma API REST simulada pelo `json-server` e utiliza o motor de templates **Pug** para a geração dinâmica de páginas HTML.

## Estrutura do Projeto:
* **servidorTPC5.js**: Servidor.
* **cinema.json**: Dataset.
* **views/**: Pasta com os templates.
* **public/**: Pasta com recursos estáticos.
---
## Lista de Rotas Implementadas:
* **GET `/` ou `/filmes`**: Página principal com a tabela de filmes (ID, título, ano, #géneros, #cast).
* **GET `/filmes/:id`**: Ficha detalhada com toda a informação de um filme específico.
* **GET `/atores`**: Lista de todos os atores únicos presentes no dataset com a contagem de filmes.
* **GET `/atores/:id`**: Página individual de um ator com a lista de filmes em que participou.
* **GET `/generos`**: (Extra) Listagem de géneros cinematográficos e respetivas estatísticas.
* **GET `/generos/:id`**: (Extra) Página de um género específico com a listagem dos filmes associados.
---
## Execução:
1. **Instalar dependências**: `npm install express axios pug`
2. **Lançar a base de dados (JSON-Server)**: `json-server --watch db.json --port 3000` (Terminal 1)
3. **Lançar o servidor aplicacional**: `node servidorTPC5.js` (Terminal 2)
4. **Aceder ao Website**: Abrir o browser em `http://localhost:25002`
