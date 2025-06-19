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
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'build')));

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
        console.error('Erro ao verificar Real Data Service:', error.message);
        res.status(500).json({
            status: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para sincronização manual
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

// Rota principal com dashboard
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fature Frontend Backoffice</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; text-align: center; }
                .status { background: #e8f5e8; padding: 20px; border-radius: 4px; margin: 20px 0; }
                .info { background: #e8f4fd; padding: 15px; border-radius: 4px; margin: 10px 0; }
                .server-info { font-family: monospace; font-size: 12px; color: #666; }
                .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
                .card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
                .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
                .btn:hover { background: #0056b3; }
                .api-section { margin: 20px 0; }
                .endpoint { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
            </style>
            <script>
                async function testEndpoint(url, elementId) {
                    const element = document.getElementById(elementId);
                    element.innerHTML = 'Carregando...';
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        element.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        element.innerHTML = '<span style="color: red;">Erro: ' + error.message + '</span>';
                    }
                }
                
                async function syncData() {
                    const element = document.getElementById('sync-result');
                    element.innerHTML = 'Sincronizando...';
                    try {
                        const response = await fetch('/api/sync', { method: 'POST' });
                        const data = await response.json();
                        element.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } catch (error) {
                        element.innerHTML = '<span style="color: red;">Erro: ' + error.message + '</span>';
                    }
                }
            </script>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Fature Frontend Backoffice</h1>
                <div class="status">
                    <h3>✅ Sistema Online</h3>
                    <p>Aplicação rodando com integração ao Real Data Service!</p>
                </div>
                
                <div class="dashboard">
                    <div class="card">
                        <h4>📊 Estatísticas</h4>
                        <button class="btn" onclick="testEndpoint('/api/stats', 'stats-result')">Buscar Estatísticas</button>
                        <div id="stats-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>👥 Usuários</h4>
                        <button class="btn" onclick="testEndpoint('/api/users', 'users-result')">Buscar Usuários</button>
                        <div id="users-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>🤝 Afiliados</h4>
                        <button class="btn" onclick="testEndpoint('/api/affiliates', 'affiliates-result')">Buscar Afiliados</button>
                        <div id="affiliates-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>💰 Comissões</h4>
                        <button class="btn" onclick="testEndpoint('/api/commissions', 'commissions-result')">Buscar Comissões</button>
                        <div id="commissions-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>💳 Transações</h4>
                        <button class="btn" onclick="testEndpoint('/api/transactions', 'transactions-result')">Buscar Transações</button>
                        <div id="transactions-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>🎰 Apostas</h4>
                        <button class="btn" onclick="testEndpoint('/api/bets', 'bets-result')">Buscar Apostas</button>
                        <div id="bets-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>🔄 Sincronização</h4>
                        <button class="btn" onclick="syncData()">Sincronizar Dados</button>
                        <div id="sync-result"></div>
                    </div>
                    
                    <div class="card">
                        <h4>🏥 Status do Real Data Service</h4>
                        <button class="btn" onclick="testEndpoint('/api/real-data-health', 'health-result')">Verificar Status</button>
                        <div id="health-result"></div>
                    </div>
                </div>
                
                <div class="api-section">
                    <h4>🔗 Endpoints da API:</h4>
                    <div class="endpoint">GET /api/users - Dados de usuários</div>
                    <div class="endpoint">GET /api/affiliates - Dados de afiliados</div>
                    <div class="endpoint">GET /api/commissions - Dados de comissões</div>
                    <div class="endpoint">GET /api/transactions - Dados de transações</div>
                    <div class="endpoint">GET /api/stats - Estatísticas do sistema</div>
                    <div class="endpoint">GET /api/real-data-health - Status do Real Data Service</div>
                    <div class="endpoint">POST /api/sync - Sincronização manual</div>
                    <div class="endpoint">GET /health - Health check do frontend</div>
                    <div class="endpoint">GET /api/status - Status da API</div>
                </div>
                
                <div class="info">
                    <h4>📊 Informações do Sistema:</h4>
                    <p><strong>Ambiente:</strong> ${process.env.NODE_ENV || 'production'}</p>
                    <p><strong>Versão:</strong> ${process.env.npm_package_version || '1.0.0'}</p>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    <p><strong>Porta:</strong> ${port}</p>
                    <p><strong>Real Data Service:</strong> ${REAL_DATA_SERVICE_URL}</p>
                </div>
                
                <div class="server-info">
                    Server: ${require('os').hostname()} | PID: ${process.pid}
                </div>
            </div>
        </body>
        </html>
    `);
});

// Catch all - serve index.html para SPAs
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Fature Frontend Backoffice rodando na porta ${port}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`🔗 Real Data Service: ${REAL_DATA_SERVICE_URL}`);
});
