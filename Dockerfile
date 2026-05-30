FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
