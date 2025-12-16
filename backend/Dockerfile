# Stage 1: Builder — билдим TypeScript (нужны devDependencies)
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и lockfile из backend
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev для tsc)
RUN npm ci

# Копируем tsconfig и исходники
COPY tsconfig.json ./
COPY src ./src

# Билдим (ваш скрипт "build": "tsc -p tsconfig.json")
RUN npm run build

# Stage 2: Production — только runtime
FROM node:20-alpine

WORKDIR /app

# Копируем package.json для production install
COPY package*.json ./

# Устанавливаем только production зависимости (меньше размер образа)
RUN npm ci --only=production && npm cache clean --force

# Копируем скомпилированный код из builder
COPY --from=builder /app/dist ./dist

# Экспозим порт (замените на ваш, если не 8080 или не из env)
EXPOSE 8080

# Production окружение
ENV NODE_ENV=production
ENV PORT=8080
# Ваши другие env (можно переопределить в Koyeb дашборде)
ENV CACHE_PROVIDER=memory
ENV CORS_ORIGIN=https://newsandnews.ru,https://maxivip-news-9235.twc1.net

# Запуск (точно как в вашем "start")
CMD ["node", "dist/server/index.js"]