# TPC2: Oficina de Reparações


## Resumo
Este segundo trabalho prático consistiu na transição de um modelo de geração estática para um modelo de servidor dinâmico utilizando **Node.js**. 

O objetivo foi criar um servidor aplicacional que comunica com uma "base de dados" (providenciada pelo `json-server`) para servir páginas HTML geradas no momento do pedido. O servidor responde a três rotas principais:
1. **Listagem de Reparações**: Apresenta todos os registos numa tabela.
2. **Tipos de Intervenção**: Agrupa as intervenções de forma única, contabilizando a sua frequência e ordenando-as alfabeticamente.
3. **Marcas/Modelos**: Lista os veículos intervencionados, calculando o histórico de reparações por modelo.

---

## Lista de resultados
* **servidor.js**: Script Node.js que contém a lógica do servidor, o roteamento e a geração dinâmica de HTML.
* **dataset_reparacoes.json**: Ficheiro JSON utilizado pelo `json-server` como fonte de dados.
* **package.json**: Ficheiro de configuração do Node.js com as dependências do projeto (axios).

---

## Execução: 
1. **Instalar dependências**: npm install axios
2. **Lançar a base de dados (JSON-Server)**: json-server --watch dataset_reparações.json
3. **Lançar o servidor aplicacional**: node servidorTPC2.js
4. **Aceder ao Website**: Colocar no browser http://localhost:25001 
