FROM node:10

# Create app directory
WORKDIR /home/node/unqfy-cluster/logging

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

CMD [ "node", "main.js" ]