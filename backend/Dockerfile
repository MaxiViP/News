FROM node:22

WORKDIR /opt/build

# Копируем package.json
COPY package*.json ./
RUN npm install

# Копируем ВСЕ файлы включая .env.production
COPY . .

# Копируем .env.production в рабочую директорию
COPY .env.production .env

# Собираем backend
RUN npm run build -w backend

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production
ENV CACHE_PROVIDER=memory

CMD ["npm", "start", "-w", "backend"]