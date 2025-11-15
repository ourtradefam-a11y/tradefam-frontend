FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use http-server instead of serve
RUN npm install -g http-server

EXPOSE 8080

# Start with http-server
CMD http-server build -p 8080 -a 0.0.0.0
