FROM node:10

# Create app directory
WORKDIR /home/node/unqfy-cluster/monitor

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5011

CMD [ "node", "main.js" ]