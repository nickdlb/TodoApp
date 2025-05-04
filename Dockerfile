# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY tailwind.config.js ./
COPY postcss.config.js ./
RUN npm run build

# Etapa 2: Produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o necessário para rodar a aplicação
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npx", "next", "start"]
