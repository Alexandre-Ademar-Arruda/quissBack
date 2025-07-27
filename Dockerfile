# Usa uma imagem base oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos da pasta atual para o container
COPY . .

# Instala as dependências do projeto
RUN npm install

# Expõe a porta (caso seu servidor use a 3000)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "server.js"]
