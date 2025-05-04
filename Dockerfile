# syntax=docker.io/docker/dockerfile:1

# Etapa base: imagem leve com Node
FROM node:18-alpine AS base

# Etapa deps: instala dependências (inclusive dev)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia os arquivos de lock + npmrc
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Instala dependências, incluindo devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Etapa builder: compila o app
FROM base AS builder
WORKDIR /app

# Copia as dependências instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copia os arquivos restantes da aplicação
COPY . .

# Compila a aplicação Next.js (Tailwind incluso)
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Etapa final: apenas arquivos necessários para rodar
FROM base AS runner
WORKDIR /app

# Agora sim define NODE_ENV como production
ENV NODE_ENV=production

# Cria usuário seguro
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copia os arquivos finais da aplicação buildada
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

# Define porta padrão do Next.js
EXPOSE 3000
ENV PORT=3000

# Comando de produção
CMD ["npx", "next", "start"]