FROM node:14-slim

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npx tsc

EXPOSE 4000

CMD ["node", "./dist/index.js"]