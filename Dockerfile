FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Start command
CMD ["sh", "-c", "serve -s build -l ${PORT:-8080}"]
