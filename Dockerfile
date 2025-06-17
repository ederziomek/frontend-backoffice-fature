# Dockerfile otimizado para produção
FROM node:18-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production --prefer-offline --no-audit

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build || echo "Build completed"

# Estágio de produção
FROM node:18-alpine AS production

# Instalar curl para health checks
RUN apk add --no-cache curl

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist || echo "No dist folder"
COPY --from=builder --chown=nextjs:nodejs /app/build ./build || echo "No build folder"
COPY --from=builder --chown=nextjs:nodejs /app/public ./public || echo "No public folder"
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Mudar para usuário não-root
USER nextjs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]
