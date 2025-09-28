FROM node:22

WORKDIR /opt/build

# Копируем package.json и ставим зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Указываем переменные окружения напрямую
ENV PORT=8080
ENV NODE_ENV=production
ENV CACHE_PROVIDER=memory
ENV CORS_ORIGIN=https://newsandnews.ru,https://maxivip-news-9235.twc1.net
ENV FOOTBALL_API_TOKEN=563b1e8db9574057a9bae05e33cbbe85

# Собираем backend
RUN npm run build -w backend

EXPOSE 8080

CMD ["npm", "start", "-w", "backend"]
