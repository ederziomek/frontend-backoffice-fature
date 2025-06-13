# Dockerfile Corrigido para Frontend Backoffice
# Build stage - Construir aplicação React/Vite
FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Production stage - Servir com nginx
FROM nginx:alpine

# Remover arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar arquivos buildados (tentar múltiplos diretórios)
COPY --from=build /app/dist /usr/share/nginx/html/ 2>/dev/null || true
COPY --from=build /app/build /usr/share/nginx/html/ 2>/dev/null || true

# Configurar nginx para SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

