FROM node:10

# Create app directory
WORKDIR /home/node/unqfy-cluster/notifications

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "node", "main.js" ]