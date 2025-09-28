FROM node:22
WORKDIR /opt/build
COPY package*.json ./
RUN npm install
COPY . .
# вместо только handlers
RUN npm run build -w backend && ls dist/routes

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production
ENV CACHE_PROVIDER=memory
ENV CORS_ORIGIN=https://maxivip-news-5c50.twc1.net
CMD ["npm", "start", "-w", "backend"]