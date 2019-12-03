FROM node:10

# Create app directory
WORKDIR /home/node/unqfy-cluster/unqfy

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "api.js" ]