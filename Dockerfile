# Multi-stage build para aplicação React/Vite
FROM node:18-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências usando npm (consistente com o workflow)
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Verificar se o diretório dist foi criado
RUN ls -la /app/dist

# Stage de produção com nginx
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

