FROM node:14

USER node
RUN mkdir -p /home/node/rate-and-rank
WORKDIR /home/node/rate-and-rank

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 8666
CMD [ "node", "index.js" ]
