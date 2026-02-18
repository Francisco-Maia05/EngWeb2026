# TPC3: Escola de Música
---
## Resumo
Este terceiro trabalho prático teve como objetivo a criação de um servidor aplicacional em Node.js para gerir e visualizar os dados de uma Escola de Música. 
Foram desenvolvidas rotas para:
1. **Alunos**: Lista detalhada com nome, instrumento e curso.
2. **Cursos**: Lista dos cursos disponíveis e respetivas durações.
3. **Instrumentos**: Lista dos vários instrumentos musicais ensinados na escola.
---
## Lista de resultados
* **servidorTPC3.js**: Script Node.js que contém a lógica do servidor e roteamento.
* **musica.json**: Dataset com os registos de alunos, cursos e instrumentos.
* **package.json**: Ficheiro de configuração com as dependências do trabalho (axios).
---
## Execução: Para colocar o sistema em funcionamento, deve seguir estes passos:

1. **Instalar dependências**: npm install axios
2. **Lançar a base de dados (JSON-Server)**: json-server --watch musica.json (Terminal 1)
3. **Lançar o servidor aplicacional**: node servidorTPC3.js (Terminal 2)
4. **Aceder ao Website**: Colocar no browser http://localhost:25001
