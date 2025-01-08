FROM node:22.12.0-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:22.12.0-alpine AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env ./  

RUN npm install --production

EXPOSE 3000

CMD ["node", "dist/src/main"]
