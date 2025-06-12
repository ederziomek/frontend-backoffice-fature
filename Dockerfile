# Railway Dockerfile
FROM node:20.18.0-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 4173

# Start the application
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "4173"]

