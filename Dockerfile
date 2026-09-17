# Dockerfile para Node.js + TypeScript
FROM node:24

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm ci

COPY ./src ./src
COPY ./config ./config
COPY ./migrations ./migrations

RUN npm run build

CMD ["npm", "run", "start"]
