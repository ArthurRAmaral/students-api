FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["npm", "run", "start"]