# TPC6: Sistema de Gestão de Cinema (Docker & MongoDB)

## Resumo
Este sexto trabalho prático consistiu na criação de uma infraestrutura completa e orquestrada para gerir um dataset de cinema. Diferente dos trabalhos anteriores, esta solução utiliza **Docker** para isolar os serviços e **MongoDB**.
O sistema divide-se em:
* **Persistência**: Base de Dados **MongoDB**.
* **API de Dados**: Servidor **Express** que gere a lógica de dados e comunicação com o Mongo via **Mongoose**.
* **Interface**: Servidor **Express** com motor de templates **Pug** para visualização do utilizador.

---

## Estrutura do Projeto
* `api_dados/`: Servidor da API, modelos Mongoose e dataset `cinema.json`.
* `interface/`: Servidor aplicacional e templates Pug para as vistas.
* `docker-compose.yml`: Configuração da orquestração dos serviços e rede interna.

---

## Lista de Rotas Implementadas

### Interface
* **GET `/filmes`**: Lista todos os filmes numa tabela (ID, Título, Ano, Elenco, Géneros).
* **GET `/filmes/:id`**: Página detalhada com toda a informação de um filme.
* **GET `/atores`**: Listagem de atores com contagem de filmes em que participaram.
* **GET `/atores/:id`**: Detalhes do ator e a sua respetiva filmografia.
* **GET `/generos`**: Lista de géneros e número de filmes associados.

### API de Dados
* Serviços REST para consulta das coleções `filmes`, `atores` e `generos`.

---

## Execução e Instalação

Criar e iniciar o contentor MongoDB:
docker run -d --name mongoEW -p 27017:27017 mongo;


Importar o dataset: 
-docker cp cinema.json mongoEW:/tmp/cinema.json
-docker exec -it mongoEW mongoimport --db cinema --collection filmes --file /tmp/cinema.json --jsonArray

Iniciar:
-docker-compose up --build

Acesso:
-Interface: http://localhost:7789
-API de Dados: http://localhost:7779
