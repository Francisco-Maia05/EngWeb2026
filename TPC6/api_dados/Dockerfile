FROM node:20

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os ficheiros de dependências
COPY package*.json ./

# Instala as dependências (express e mongoose)
RUN npm install

# Copia o código fonte do servidor
COPY . .

# Expõe a porta que definiste no teu código (7779)
EXPOSE 7779

# Comando para iniciar o servidor
CMD [ "node", "servidor.js" ]