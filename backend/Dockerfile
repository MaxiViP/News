# --- Stage 1: build ---
FROM node:22 AS build
WORKDIR /opt/build

# Копируем backend
COPY backend ./backend

# Ставим зависимости и билдим
WORKDIR /opt/build/backend
RUN npm install --frozen-lockfile || npm install
RUN npm run build

# --- Stage 2: run ---
FROM node:22
WORKDIR /app

# Копируем только собранный dist + package.json
COPY --from=build /opt/build/backend/dist ./dist
COPY --from=build /opt/build/backend/package*.json ./

# Устанавливаем только прод-зависимости
RUN npm install --omit=dev

# Контейнер будет слушать порт
EXPOSE 8080

# Запуск
CMD ["node", "dist/server/index.js"]
