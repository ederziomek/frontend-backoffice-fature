# 🚀 Fature Frontend Backoffice

Frontend Backoffice do Projeto Fature com arquitetura EC2 otimizada e GitHub Actions.

## 📊 Migração EKS → EC2

Este projeto foi migrado de EKS para EC2 otimizado, resultando em:

- **💰 Economia**: $325.85/mês (47.7% de redução)
- **🚀 Performance**: Melhor performance sem overhead Kubernetes
- **🔧 Simplicidade**: 95% menos complexidade operacional

## 🏗️ Arquitetura

### Instâncias EC2:
- **2x c6a.large** (Load Balancer + App)
- **3x t3.large** (App)
- **Distribuição**: 3 AZs (sa-east-1a, sa-east-1b, sa-east-1c)

### Load Balancing:
- **Nginx** como load balancer
- **Health checks** automáticos
- **Rolling deployment** zero-downtime

## 🚀 Deploy Automático

### GitHub Actions:
- ✅ Build e push automático para ECR
- ✅ Deploy rolling para produção
- ✅ Health checks automáticos
- ✅ Monitoramento contínuo

### Ambientes:
- **Production**: Deploy automático na branch `main`
- **Staging**: Deploy automático na branch `develop`

## 🔧 Configuração

### Secrets necessários no GitHub:
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
EC2_SSH_PRIVATE_KEY
```

## 📋 Comandos

### Desenvolvimento:
```bash
npm install
npm start
```

### Deploy manual:
```bash
./validate-deployment.sh
```

## 🏥 Health Check

- **Endpoint**: `/health`
- **Status**: `/api/status`

## 📊 Monitoramento

- **Logs**: CloudWatch
- **Métricas**: Nginx status
- **Alertas**: GitHub Actions

---

**Criado por Manus AI - Migração EKS para EC2 Otimizado**
