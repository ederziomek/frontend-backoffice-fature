const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Configuração do Real Data Service
const REAL_DATA_SERVICE_URL = process.env.REAL_DATA_SERVICE_URL || 'https://fature-real-data-service-production.up.railway.app';

// Middleware para parsing JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        real_data_service: REAL_DATA_SERVICE_URL
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.status(200).json({
        api: 'online',
        timestamp: new Date().toISOString(),
        real_data_service: REAL_DATA_SERVICE_URL
    });
});

// Proxy endpoints para Real Data Service
app.get('/api/users', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/users`, {
            params: req.query,
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar dados de usuários',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/stats`, {
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar estatísticas',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/affiliates', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/affiliates`, {
            params: req.query,
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar afiliados:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar dados de afiliados',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/bets', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/bets`, {
            params: req.query,
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar apostas:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar dados de apostas',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/commissions', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/affiliates`, {
            params: req.query,
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar comissões:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar dados de comissões',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/data/v2/transactions`, {
            params: req.query,
            timeout: 30000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar transações:', error.message);
        res.status(500).json({
            error: 'Erro ao buscar dados de transações',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/real-data-health', async (req, res) => {
    try {
        const response = await axios.get(`${REAL_DATA_SERVICE_URL}/health`, {
            timeout: 15000
        });
        res.json({
            status: 'connected',
            real_data_service: response.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao conectar com Real Data Service:', error.message);
        res.status(500).json({
            status: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/api/sync', async (req, res) => {
    try {
        const response = await axios.post(`${REAL_DATA_SERVICE_URL}/sync/v2`, {}, {
            timeout: 60000
        });
        res.json({
            status: 'success',
            sync_result: response.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro na sincronização:', error.message);
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Rota principal - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota catch-all para SPA
app.get('*', (req, res, next) => {
    // Se for uma rota de API, continuar para os handlers da API
    if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return next();
    }
    // Caso contrário, servir o index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log('==================================================');
    console.log('🚀 FATURE FRONTEND BACKOFFICE INICIADO');
    console.log('==================================================');
    console.log(`📡 Porta: ${port}`);
    console.log(`🔗 Real Data Service: ${REAL_DATA_SERVICE_URL}`);
    console.log('==================================================');
    console.log('📋 Endpoints disponíveis:');
    console.log('   - GET / - Interface principal');
    console.log('   - GET /health - Health check');
    console.log('   - GET /api/affiliates - Dados de afiliados');
    console.log('   - GET /api/users - Dados de usuários');
    console.log('   - GET /api/stats - Estatísticas');
    console.log('   - GET /api/real-data-health - Status do Real Data Service');
    console.log('==================================================');
});

