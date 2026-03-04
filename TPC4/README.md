# TPC4: Exames Médicos Desportivos
---
## Resumo:
Este quarto trabalho prático consistiu na criação de um servidor aplicacional em Node.js para a gestão e visualização de um dataset de Exames Médicos Desportivos 

## Estrutura do Projeto:
* **emd_server.js**: Servidor.
* **templates.js**: ponte entre o servidor e os ficheiros PUG.
* **static.js**: Módulo responsável por servir recursos estáticos.
* **emd.json**: Dataset.
* **views/**: Pasta com os templates Pug (`layout.pug`, `index.pug`, `form.pug`, `emdPage.pug`, `emdStats.pug`, `error.pug`).
* **public/**: Pasta com recursos estáticos.
---
## Lista de Rotas Implementadas:
| **GET** | `/` ou `/emd` | Página principal com a tabela de exames. |
| **GET** | `/emd?sort=data` | Lista ordenada por data (decrescente). |
| **GET** | `/emd?sort=nome` | Lista ordenada por nome (crescente). |
| **GET** | `/emd/:id` | Ficha detalhada do exame médico. |
| **GET** | `/emd/registo` | Formulário para criação de novo registo. |
| **GET** | `/emd/editar/:id` | Formulário para edição de um registo. |
| **GET** | `/emd/apagar/:id` | Remoção de um registo e redirecionamento. |
| **GET** | `/emd/stats` | Estatísticas e distribuições dos dados. |
| **POST** | `/emd` | Inserção de um novo registo na base de dados. |
| **POST** | `/emd/:id` | Atualização de um registo existente. |
---
## Execução: Para colocar o sistema em funcionamento, deve seguir estes passos:

1. **Instalar dependências**: npm install axios pug
2. **Lançar a base de dados (JSON-Server)**: json-server --watch emd.json (Terminal 1)
3. **Lançar o servidor aplicacional**: node emd_server.js (Terminal 2)
4. **Aceder ao Website**: Colocar no browser http://localhost:7777
