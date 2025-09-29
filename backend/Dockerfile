FROM node:22
WORKDIR /opt/build

# Сначала зависимости
COPY package*.json ./
RUN npm install

# Копируем весь код
COPY . .

# 👇 Копируем .env.production внутрь контейнера как .env
COPY .env.production .env

# Собираем backend
RUN npm run build -w backend

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production
ENV CACHE_PROVIDER=memory
ENV CORS_ORIGIN=https://newsandnews.ru,https://maxivip-news-9235.twc1.net

CMD ["npm", "start", "-w", "backend"]
