FROM node:22

# Рабочая директория
WORKDIR /opt/build

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь код, включая .env.production
COPY . .

# Собираем backend (и сразу проверяем что matches.js попал в dist/routes)
RUN npm run build -w backend && ls -la backend/dist/routes

# Указываем, что сервер слушает порт 8080
EXPOSE 8080

# Основные ENV
ENV PORT=8080
ENV NODE_ENV=production
ENV CACHE_PROVIDER=memory

# ⚡ ВАЖНО: теперь .env.production доступен внутри контейнера
# dotenv автоматически подхватит его, т.к. у тебя:
# dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' })

# Запуск backend
CMD ["npm", "start", "-w", "backend"]
