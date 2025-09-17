FROM node:22
WORKDIR /opt/build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -w backend
RUN npm run build -w frontend
EXPOSE 8080
CMD ["npm", "start", "-w", "backend"]