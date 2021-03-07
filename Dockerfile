FROM node:alpine

WORKDIR /opt/myapp

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD [ "npm", "start"]
