FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node","server.js"]
