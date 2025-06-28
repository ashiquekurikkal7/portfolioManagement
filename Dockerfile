FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files (including db.json inside jsonserver/)
COPY . .

# Expose both ports
EXPOSE 5173
EXPOSE 4000

# Start both Vite and JSON server
CMD ["npm", "run", "dev:all"]
