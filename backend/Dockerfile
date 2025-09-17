FROM node:22
WORKDIR /opt/build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -w backend
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production
ENV NEWSAPI_KEY=3f1863b3b1bf46c386cd23b0fafbb20a
ENV CACHE_PROVIDER=memory
ENV CORS_ORIGIN=https://maxivip-news-5c50.twc1.net
CMD ["npm", "start", "-w", "backend"]