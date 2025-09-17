FROM node:22-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY backend/package*.json ./
RUN npm install --production

# Копируем исходники и билдим
COPY backend ./
RUN npm run build

# Экспресс слушает PORT
EXPOSE 8080
CMD ["npm", "start"]
