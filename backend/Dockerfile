FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Backend của bạn chạy mặc định 5000 bên trong, chúng ta sẽ map ra 5001
EXPOSE 5000
CMD ["npm", "start"]